# Path Games AI

Path Games is a collection of two interactive web games powered by classical AI algorithms: Firegame and Mousegame.

* In Firegame, the player must navigate a maze while avoiding fire and racing to reach a fire suppressor.

* In Mousegame, the player explores a maze using a sensor to locate a hidden mouse.

Path Games began as a Rutgers project focused on developing AI bots to solve these challenges. This web app expands on that work by visualizing bot behavior, allowing users to watch replays and compare their own performance against the bots. The story and concept behind these games came from my class.

A live demo can be found at http://path-games.vercel.app .

## Firegame

<img width="400" alt="FiregameImage copy" src="https://github.com/user-attachments/assets/ae699df8-efae-4d5f-83b1-2c0dd1f16e70" />

The goal of Firegame is to navigate the maze and reach the fire suppressor without stepping in a fire square.

The fire spreads stochastically. The probability of an open square catching on fire at a given time is $1-(1-q)^K$, where $q$ is flammability parameter (higher $q$ = more flammable), and $K$ is the number of neighbors the square has on fire (higher $K$ = more flammable). The parameter $q$ was only adjusted in adjusted in bot tests; in the game I published, $q$ is fixed at $.4$. Only open squares (light gray) can catch on fire. Closed squares and the fire suppressor cannot catch on fire.

### Firegame Bots

There are four bots that can be visualized in the Firegame visualizer.

* Bot 1 plans a shortest path given by BFS, and sticks with it, no matter how the fire unfolds.
* Bot 2 plans a shortest path given by BFS, and replans a new shortest path if fire enters one of its planned squares.
* Bot 3 plans a shortest path given by BFS, and replans a new shortest path if fire enters a square adjacent to one of its planned squares. If possible, it will avoid fire adjacent squares.

The first three bots are meant to be baselines for comparison with the fourth bot, whose design was the focal point of my class assignment. Bot 4, at the beginning of each game, runs 50 fire simulations to see how the fire might unfold. This gives a 3D set of weights called `weights`, where the probability of there being a fire at space $(i,j)$ at time $t$ is proportional to `weights[i][j][t]`. The bot then makes a 3D graph and runs a spatiotemporal uniform cost search: If the current node being explored a node at time $r$, then the next node explored will be a node at time $r+1$. In this way, bot 4, unlike the other bots, accounts for where the fire will be at the time the fire will be there. If fire enters a square adjacent to bot 4's path, then bot 4 reverts to doing what bot 3 will do. But bot 4 setting off on its own path at the start is often enough for success, and to differentiate it from bot 3.

### Why use simulation? 

A natural question is, why use a simulation/sampling process, rather than make an exact probability distribution, using a Bayesian prediction algorithm? The problem with this can be illustrated by the picture above. There are 22 open squares with fire neighbors. Say at this point the time is $t$. If we were to use prediction algorithm naively, we would have to account for all of the possibilities of how the fire can turn out on turn $t+1$, which comes out to $2^{22}=4194304$ possible fires. Then, if we wanted to predict one more turn into the future, at time $t+2$, for each of these $2^{22}$ ways the fire could turn out on turn $t+1$, there would be on the order of $2^{22}$ ways the fire could turn out from there. It is easy to see that brute force calculation of probabilities leads to combinatorial blowup, so making exact predictions is not feasible. There are ways to cut corners with these kinds of calculations and make approximations. One thing I want to experiment with in the future is only doing localized predictions - from the picture above, most of the fire probabilities are irrelevant, so I think there might be a way to only calculate the probabilities that are necessary to make predictions. But simulation is a practical, effective approach.

Another thing one might ask is, why use uniform cost search instead of something like A*? The answer is that the graph being searched is relatively small, and takes a fraction of a second to search, and since A* and uniform cost search will give the same answer on this small space, there is no reason to use A*.

Some other approaches for bot 4, such as doing more simulations, did not yield better results in experiments.

In my game, there are three difficulty levels: Easy, medium, and hard. The difficulty of the map is determined by bot performance. If bot 1 passes a potential game map, then it is discarded for being too easy. If bot 2 or 3 passes, the map is easy. If bots 2 and 3 fail but bot 4 passes, the map is medium. If all of the bots fail but success is possible, the map is hard. In the Firegame visualizer, when visualizing hard games, a bot with the number 5 represents the path that could have been taken for success, but never was.

## Mousegame

<img width="800" alt="image" src="https://github.com/user-attachments/assets/9190ce73-bbdb-4fea-a030-0a7033acbeba" />

The goal of Mousegame is to use the sensor to find a hidden mouse before the bot does. There are two modes: Stationary mouse and moving (stochastic) mouse.

The sensor works probabilistically. If the player or the bot is $d$ away from the mouse (Manhattan distance), then the probability of the sensor beeping is $e^{-\alpha(d-1)}$, where $\alpha$ is a sensitivity parameter. In the live game, $\alpha$ is fixed at $.1155=-\frac{ln(.5)}{(7-1)}$. The reason for this choice of $\alpha$ is that when the distance between the mouse and player is $7$, the probability of a beep is $.5$.

### Mousegame Bots

I used temporal modeling to model the ship as a Markov chain. This is valid because the location of the mice at each new time step in the ship depend only on the time step immediately before it. Each time step on the ship grid represents a new state $X_t$, where $P(X_t=x_t)$ is the probability that there is a mouse at location $x_t$ at time $t$. For each time step $t$, the bots each gain new evidence $e_t$ (each bot respectively gets their own evidence per time step).

Let **P** denote a probability distribution. I have a function in my code called `filtering`, which is a straightforward filtering function that calculates **P**$(X_{t}|e_1,...,e_t)$. This distribution can be calculated recursively, via

**P**$(X_{t+1}|e_1,...,e_{t+1})=\alpha'$**P**$(e_{t+1}|X_{t+1})\sum_{x_t}$**P**$(X_{t+1}|x_t)P(x_t|e_1,...,e_t)$

where $\alpha'$ normalizes the distribution.

Bot 1 senses, then goes to highest probabilitity square, then repeats.

Bot 2 senses, and alternates sensing and moving as it goes to the highest probability square.

These bots were the baseline. Bot 3 was my first my attempt at bettering these. Bot 3 alternates sensing and moving, but only plans five steps at time. This simple change leads to much better results. If the mouse is stationary, the bot sums up each contiguous 7x7 subgrid, and if there is a 7x7 subgrid with probabilities whose sum is higher than .5, it goes into bot 1 mode.

Bot 4 was my second attempt. Let $X_t$ be a random variable that represents the state, i.e. $P(X_t=(i,j))$ is the probability that the mouse is in $(i,j)$ at time $t$, and let $B_{ijt}$ be a random variable with values $+$ and $-$, where $P(B_{ijt}=+)$ is the probability of getting a positive sense at space $(i,j)$ at time $t$.

In entropy reduction mode, when the bot plans its path, one strategy would be to calculate the expected entropy reduction $f(i,j)$ at each space $(i,j)$ in the grid:

$$f(i,j)=H(X_t)-\mathbb{E}[H(X_t|B_{ijt})]$$

where for a random variable $Y$, $H(Y)=-\sum_y P(y)\log P(y)$ denotes the Shannon entropy of $Y$, and then move to the space with maximum expected entropy reduction. In practice, this did not give as great of results as I hoped for. The incentive to minimize $H(X_t|B_{ijt}=+)$ led the bot to explore corners and edges in early stages of the simulation. Instead, it was useful to calculate for each space $(i,j)$:

$$g(i,j)=H(X_t)-H(X_t|B_{ijt}=-)$$

The bot going to the space that maximized $g$ led to the bot behaving in ways that I wanted to - exploring the board, sensing many times, preferring central areas. I found that the bot better passed the eye test this way. Bot 4 also checks for 7x7 sums of probabilities being greater than .5, and goes into bot 1 mode on stationary mouse mode, and bot 3 mode on stochastic mouse mode.




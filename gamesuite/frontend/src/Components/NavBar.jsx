

export default function NavBar(){
    return(<nav className='navbar'>
        <div className="navbar-left">
            <a href="/" className="logo">
            My Website
            </a> 
        </div>
        <div className="navbar-right">

            <a href="/login" className="login">
            Login
            </a>
            <a href="/register" className="register">
            Register
            </a>
        </div>
        </nav>)}
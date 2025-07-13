import { useParams } from "react-router-dom"
import { useState } from "react";
import api from "../api";
import { USERNAME } from "../constants";

//Account component. Later will have account info. For now, all that really happens here is the user can change their password

export default function Account(){
    const {username} = useParams();
    const [changePassword, setChangePassword] = useState(false);
    const [oldPassword,setOldPassword] = useState('');
    const [newPassword1,setNewPassword1] = useState('');
    const [newPassword2,setNewPassword2] = useState('');
    const [passwordSuccess,setPasswordSuccess] = useState(false);
    const [error,setError] = useState('');

    //Change password submission
    const handleSubmit = async e => {
        e.preventDefault();
        setError('')
        if(newPassword1!==newPassword2){
          setTimeout(()=>setError("The passwords don't match. Try again."),200)
          return
        }
        const passwordChangeRes = await api.post('change_password/',{current_password:oldPassword, new_password:newPassword1})
                                .catch((error)=>{setError(error); console.log(error); return null;});
        console.log(passwordChangeRes);
        if(passwordChangeRes.data.success){
            setPasswordSuccess(true);
            setChangePassword(false);
            setOldPassword('');
            setNewPassword1('');
            setNewPassword2('');
        }else{
            setError(passwordChangeRes.data.error)
        }
      };

    //Make sure user can't go to another user's account page
    const realusername = localStorage.getItem(USERNAME)
    if(realusername!==username){
        return <div className="flex flex-col items-center"><div className="mt-12">Not authorized</div></div>
    }
    return <div>
          <div className='m-24'></div>
          <div className='pl-48 text-cyan-200'>
            <h1 className="text-2xl mb-3">{username}</h1>
            <button className="hover:underline text-white" onClick={()=>setChangePassword(prev=>!prev)}>Change Password</button>
            {changePassword && <form  className='text-black' onSubmit={handleSubmit}>
              <input
                className='border w-64 border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword((prev)=>{const value = e.target.value; 
                                            if(/^[a-zA-Z0-9\s.,!?]*$/.test(value)){
                                            return value;
                                            };
                                            setError('Passwords are alphanumeric and . , ! ? only.')
                                            return prev;})}
                placeholder="Old password"
              />
              <div></div>
              <input
                className='border w-64 border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
                type="password"
                value={newPassword1}
                onChange={e => setNewPassword1((prev)=>{const value = e.target.value; 
                                            if(/^[a-zA-Z0-9\s.,!?]*$/.test(value)){
                                            return value;
                                            };
                                            setError('Passwords are alphanumeric and . , ! ? only.')
                                            return prev;})}
                placeholder="New password"
              />
              <div></div>
              <input
                className='border w-64 border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
                type="password"
                value={newPassword2}
                onChange={e => setNewPassword2((prev)=>{const value = e.target.value; 
                                            if(/^[a-zA-Z0-9\s.,!?]*$/.test(value)){
                                            return value;
                                            };
                                            setError('Passwords are alphanumeric and . , ! ? only.')
                                            return prev;})}
                placeholder="Re-enter new password"
              />
              <div className='text-red-400'>{error}</div>
              <button className='mt-4 hover:bg-blue-200 bg-blue-300 rounded-3xl pl-4 pr-4 pt-2 pb-2 font-bold' type="submit">Submit</button>
              
            </form>}
            {passwordSuccess && <div className="text-green-500">Password changed successfully.</div>}
          </div>
      </div>
}
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { app } from '../firebase.js';
import {getDownloadURL, getStorage , ref, uploadBytesResumable} from 'firebase/storage';
import {updateUserFailure, updateUserStart, updateUserSuccess} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [file , setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);  
  const dispatch = useDispatch();
  // console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(downloadURL);

  

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        const progress = 
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>


        <input 
          onChange={(e)=>setFile(e.target.files[0])} 
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/.*'
        />

        <img 
          onClick={()=>fileRef.current.click()} 
          className='self-center mt-2 rounded-full h-24 w-24 object-cover cursor-pointer ' 
          src={formData.avatar || currentUser.avatar} 
          alt='profile photo'
        />


        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        

        <input type='text' defaultValue={currentUser.username} placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type='email' defaultValue={currentUser.email} placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

        <button disabled={loading}className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>

      </form>

      <div className='flex mt-5 justify-between'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
        <p className='text-red-700 mt-5'>
          {error ? error : ""}
        </p>
        <p className='text-green-700'>
          {updateSuccess ? 'User Updated Successfully!' : "" }
        </p>
    </div>
  )
}

export default Profile








































// const handleFileUpload = () => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + file.name;
  //   const storageRef = ref(storage, fileName)
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on('state_changed',
  //     (snapshot) => {
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setFilePerc(Math.round(progress));
  //       console.log('Upload is '+ progress +'% done')
  //     });
  //     // (error) => {
  //     //   setFileUploadError(true);   
  //     // };
  //     // ()=>{
  //     //   getDownloadURL(uploadTask.snapshot.ref).then
  //     //   ((downloadURL)=>{
  //     //      setFormData({...formData, avatar:downloadURL});
  //     //   });
  //     // }
  // };
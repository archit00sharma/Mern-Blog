import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import { updateStart, updateSuccess, updateError, deleteUserStart, deleteUserSuccess, deleteUserError, signOutSuccess } from '../redux/user/userSlice'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashProfile() {

    const { currentUser, error } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({})
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUplaodingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUpload, setImageFileUpload] = useState(false)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const dispatch = useDispatch()
    const filePickerRef = useRef()

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        setImageFileUpload(true)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No Changes Made')
            return
        }
        try {
            if (imageFileUpload) { setUpdateUserError('Please wait for image to upload'); return }

            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser.data._id}`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {

                dispatch(updateError(data.message))
                setUpdateUserError(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess('User Profile Updated Successfully')
            }
        } catch (error) {

            dispatch(updateError(error))
            setUpdateUserError(error)
        }
    };
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser.data._id}`, {
                method: 'DELETE',
            })
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserError(data.message))
            } else {
                deleteUserSuccess(data)
            }
        } catch (error) {
            dispatch(deleteUserError(error.message))
        }
    };
    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })
            // const data = await res.json();
            if (!res.ok) {
                console.log('rrrrrrrrr', res)
            } else {
                dispatch(signOutSuccess())
            }
        } catch (error) {
            console.log("error>>>>>>>", error)
        }
    }

    useEffect(() => {
        if (imageFile && imageFile.name) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUpload(true)
        setImageFileUploadError(null)
        const storage = getStorage(app);

        const fileName = new Date().getTime() + '_' + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (!isNaN(progress) && progress) { // Check for NaN
                    setImageFileUploadingProgress(progress.toFixed(0));
                }
            },
            (error) => {
                setImageFileUploadError(error.message)
                setImageFileUploadingProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUpload(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUpload(false)
                    setImageFile(downloadUrl)
                    setFormData({ ...formData, profilePicture: downloadUrl })
                })
            }
        )
    };


    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>
                profile
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" id='profilePicture' name='profilePicture' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className=" relative w-32 h-32 self-center cursor-pointer shadow-sm overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    {imageFileUplaodingProgress && (
                        <CircularProgressbar value={imageFileUplaodingProgress || 0} text={`${imageFileUplaodingProgress}%`} strokeWidth={5} styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            },
                            path: {
                                stroke: `rgba(62,152,199,${imageFileUplaodingProgress / 100})`
                            }
                        }} />
                    )}
                    <img src={imageFileUrl || currentUser?.data?.profilePicture} alt='user' className={` rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUplaodingProgress && imageFileUplaodingProgress < 100 && 'opacity-60'}`} />
                </div>
                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                <TextInput onChange={handleChange} type='text' name='username' id='username' placeholder='username' defaultValue={currentUser.data.username} />
                <TextInput onChange={handleChange} type='text' name='email' id='email' placeholder='email' defaultValue={currentUser.data.email} />
                <TextInput onChange={handleChange} type='password' name='password' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess &&
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            }
            {updateUserError &&
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            }
            {error &&
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I am sure
                            </Button>

                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

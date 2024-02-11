import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUplaodingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const filePickerRef = useRef()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }

    };

    useEffect(() => {
        if (imageFile && imageFile.name) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFile(downloadUrl)
                })
            }
        )
    }



    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>
                profile
            </h1>
            <form className='flex flex-col gap-4'>
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
                <TextInput type='text' name='username' id='username' placeholder='username' defaultValue={currentUser.data.username} />
                <TextInput type='text' name='email' id='email' placeholder='email' defaultValue={currentUser.data.email} />
                <TextInput type='password' name='password' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

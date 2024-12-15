import React, { useRef, useState } from 'react'
import 'cropperjs/dist/cropper.css'
import { Cropper } from 'react-cropper'

const Mainpage = () => {
    const [image, setImage] = useState(null)
    const cropperRef = useRef(null)
    const [arrnumber, setArrnumber] = useState(0)
    const [imgarray, setImgArray] = useState([])
    const [sliderValue, setSliderValue] = useState(0)
    const [prevvalue, setPrevValue] = useState(0)
    const [format, setFormat] = useState('png')

    const handleImageData = (e) => {
        const file = e.target.files[0]
        if (file) {
            const readimage = new FileReader()
            readimage.readAsDataURL(file)
            readimage.onload = () => {
                setImage(readimage.result)
                setImgArray((prevarray) => [...prevarray, readimage.result])
            }
        }
    }

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper
        if (cropper) {
            const croppedimage = cropper.getCroppedCanvas()
            const changedformat = croppedimage.toDataURL('image/jpg')
            setImgArray((prevarray) => [...prevarray, changedformat])
            setImage(changedformat)
            setArrnumber(arrnumber + 1)
        }
    }

    const handleUndo = () => {
        const arrindex = arrnumber - 1
        setArrnumber(arrnumber - 1)
        setImage(imgarray[arrindex])
    }

    const handleRedo = () => {
        const arrindex = arrnumber + 1
        setArrnumber(arrnumber + 1)
        setImage(imgarray[arrindex])
    }

    const handleRotate = (e) => {
        setSliderValue(e.target.value)
        const cropper = cropperRef.current?.cropper
        cropper.rotate(sliderValue - prevvalue)
        setPrevValue(sliderValue)
    }
    const handleDownload = () => {
        const cropper = cropperRef.current?.cropper
        
        if (cropper) {
          const imageWidth = image.naturalWidth
          const imageHeight = image.naturalHeight
      
          const canvas = cropper.getCroppedCanvas({
            width: imageWidth,
            height: imageHeight
          })
      
          if (canvas) {
            let mimeType
            let fileExtension
      
            if (format === 'jpg') {
              mimeType = 'image/jpeg'
              fileExtension = 'jpg'
            } else if (format === 'webp') {
              mimeType = 'image/webp'
              fileExtension = 'webp'
            } else {
              mimeType = 'image/png'
              fileExtension = 'png'
            }
      
            const link = document.createElement('a')
            link.href = canvas.toDataURL(mimeType)
            link.download = `edited-image.${fileExtension}`
            link.click()
          } else {
            alert('No image found to download.')
          }
        } else {
          console.error('no editing done .')
        }
      }
     const handleFilter = (filter) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
        // Get the original image dimensions
        const imageWidth = cropper.getImageData().naturalWidth;
        const imageHeight = cropper.getImageData().naturalHeight;

        // Create a new canvas with the original image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Apply the filter
            ctx.filter = filter;

            // Draw the original image onto the new canvas
            const imageElement = new Image();
            imageElement.src = image;
            imageElement.onload = () => {
                ctx.drawImage(imageElement, 0, 0, imageWidth, imageHeight);

                // Convert the filtered canvas to a data URL
                const filteredImageURL = canvas.toDataURL();

                // Update the image and cropper
                setImage(filteredImageURL);
                cropper.replace(filteredImageURL);
            };
        }
    }
};

      
    
    
  
  
  

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
            <h1 className="text-3xl font-bold text-gray-800 p-1">Image Editor</h1>
            <input
                type="file"
                onChange={handleImageData}
                className="mb-4 p-2 border rounded bg-white text-gray-800"
            />
            <div className="flex justify-center items-center bg-gray-200 p-4 rounded">
                <Cropper
                    ref={cropperRef}
                    src={image}
                    className="w-96 h-96"
                />
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
                <button
                    onClick={handleCrop}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                    Crop Image
                </button>
                <button
                    onClick={handleUndo}
                    disabled={arrnumber === 0}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition disabled:opacity-50">
                    Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={arrnumber === imgarray.length - 1}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition disabled:opacity-50">
                    Redo
                </button>


                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="p-2 border  rounded bg-white text-gray-800"
                >
                    <option value="png">PNG (if rotating)</option>
                    <option value="jpg">JPG</option>
                    <option value="webp">WEBP</option>
                </select>



                <button
                    onClick={handleDownload}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                    Download
                </button>
                
            </div>
            <div className="mt-3 w-full flex flex-col items-center">
                <label
                    htmlFor="slider"
                    className="mb-2 text-gray-700 font-medium">
                    Rotate Image ({sliderValue}°)
                </label>
                <input
                    id="slider"
                    type="range"
                    min="-180"
                    max="180"
                    value={sliderValue}
                    onChange={handleRotate}
                    className="w-3/4"
                />
            </div>
            <button className='bg-slate-700 p-3 rounded-md' onClick={() => handleFilter('sepia(100%)')}> APPLY SEPIA</button>
            <button className='bg-slate-700 p-3 rounded-md' onClick={() => handleFilter('grayscale(100%)')}> APPLY G</button>

        </div>
    )
}

export default Mainpage

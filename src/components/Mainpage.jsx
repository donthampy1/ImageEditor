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
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
          const canvas = cropper.getCroppedCanvas({
              fillColor: 'transparent', // Set transparent background
          });
  
          const rotationAngle = cropper.getData().rotate || 0; // Get rotation angle
  
          if (canvas) {
              // Calculate dimensions for the rotated canvas
              const rotatedCanvas = document.createElement('canvas');
              const context = rotatedCanvas.getContext('2d');
              
              // Set rotated canvas size to accommodate the rotated image
              const angleInRadians = (rotationAngle * Math.PI) / 180;
              const absCos = Math.abs(Math.cos(angleInRadians));
              const absSin = Math.abs(Math.sin(angleInRadians));
              rotatedCanvas.width = canvas.width * absCos + canvas.height * absSin;
              rotatedCanvas.height = canvas.width * absSin + canvas.height * absCos;
  
              // Apply rotation to the context
              context.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
              context.rotate(angleInRadians);
              context.translate(-canvas.width / 2, -canvas.height / 2);
  
              // Clear the background to ensure transparency
              context.clearRect(0, 0, rotatedCanvas.width, rotatedCanvas.height);
  
              // Draw the original cropped canvas onto the rotated context
              context.drawImage(canvas, 0, 0);
  
              // Create the download link
              const link = document.createElement('a');
              link.href = rotatedCanvas.toDataURL('image/png'); // Save as PNG for transparency
              link.download = 'cropped-rotated-image.png';
              link.click();
          }
      }
  };
  
  
  

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
            <h1 className="text-3xl font-bold text-gray-800 p-1">Image Cropper</h1>
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
        </div>
    )
}

export default Mainpage

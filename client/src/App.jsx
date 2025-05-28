import { useForm } from "react-hook-form"
import axios from 'axios'
import { useState } from "react"
// import Output from "./Output"
import AnalysisViewer from "./AnalysisViewer"
// import { post } from "../../server/routes/FileUpload"
// basic example of how to use react-hook form
// function App() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm()

//   async function onSubmit(data) {
//     // api call simulate
//     await new Promise((resolve) => setTimeout(resolve, 5000))
//     console.log("submitting the form", data)
//   }
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>

//       <div>
//         <label>First Name:</label>
//         <input
//           className="border 1px border-solid"
//           // registering the field with its name 
//           {...register('firstName')}></input>
//       </div>
//       <br></br>

//       <div>
//         <label>Middle Name:</label>
//         <input

//           {...register('middleName',
//             {
//               required: true,
//               minLength: { value: 3, message: 'Min length atleast 3' },
//               maxLength: 10
//             })
//           }></input>
//         {/* to make error visible */}
//         {errors.middleName && <p className="text-red-600">{errors.middleName.message}</p>}
//       </div>
//       <br></br>

//       <div>
//         <label>Last Name:</label>
//         <input
//           {...register('lastName')}
//           className="border 1px border-solid"></input>
//       </div>

//       {/* if dont want to submit until the previous submissin is performing */}
//       <input
//         className="border 1px border-solid"
//         type="submit"
//         disabled={isSubmitting}
//         value={isSubmitting ? "Submitting" : "Submit"}></input>
//       <br></br>
//     </form>
//   )
// }



// main code starts from here



function App() {
  const [clicked, setClicked] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append('audio', data.uploadAudio[0])
      formData.append('image', data.uploadImage[0])
      formData.append('video', data.uploadVideo[0])

      // api call simulate
      const res = await axios.post("http://localhost:4000/api/v1/upload/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      console.log(res)

    }
    catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">📁 Upload Files for Analysis</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Audio Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Audio</label>
          <input
            type="file"
            accept="audio/*"
            {...register("uploadAudio", { required: true })}
            className="mt-1 block w-full text-sm border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.uploadAudio && <p className="text-red-500 text-sm mt-1">Audio file is required</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("uploadImage", { required: true })}
            className="mt-1 block w-full text-sm border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {errors.uploadImage && <p className="text-red-500 text-sm mt-1">Image file is required</p>}
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            {...register("uploadVideo", { required: true })}
            className="mt-1 block w-full text-sm border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {errors.uploadVideo && <p className="text-red-500 text-sm mt-1">Video file is required</p>}
        </div>

        {/* Submit Button */}
        <div>
          <input
            type="submit"
            disabled={isSubmitting}
            value={isSubmitting ? "Submitting..." : "Submit"}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
          />
        </div>
      </form>

      {/* Analysis Toggle */}
      <div className="pt-4 border-t">
        <button
          onClick={() => setClicked(!clicked)}
          className="w-full py-2 px-4 rounded-md text-white bg-gray-800 hover:bg-gray-900 transition"
        >
          {clicked ? "🔽 Hide Analysis" : "🔍 Show Analysis"}
        </button>

        {clicked && (
          <div className="mt-4">
            <AnalysisViewer />
          </div>
        )}
      </div>
    </div>
  );
}

export default App

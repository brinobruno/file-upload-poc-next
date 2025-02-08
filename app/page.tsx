import SimpleUploadForm from "@/components/simple-upload-form"
import ComplexUploadForm from "@/components/complex-upload-form"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">File Upload Demonstration</h1>
      <p className="mb-8 text-lg">
        {`This example demonstrates two different approaches to file uploading: a simple method using FormData and a more
        complex method using React Hook Form with base64 encoding. Both methods have their use cases and advantages,
        which we'll explore below.`}
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Simple Upload (FormData)</h2>
          <p className="mb-4">
            {`The simple upload method uses the built-in FormData API to send files to the server. This approach is
            straightforward and works well for basic file uploads without additional form data. It's ideal for scenarios
            where you only need to upload a file without any extra information.`}
          </p>
          <SimpleUploadForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Complex Upload (React Hook Form + Base64)</h2>
          <p className="mb-4">
            {`The complex upload method uses React Hook Form for form handling and converts the file to a base64 string.
            This approach allows for more flexibility in sending additional data along with the file and is useful for
            complex forms or when you need to manipulate the file data before sending it to the server.`}
          </p>
          <ComplexUploadForm />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comparing the Two Approaches</h2>
        <p className="mb-4">
          {`The simple FormData approach is easier to implement and more efficient for large files, as it streams the file
          data directly to the server. However, it's limited in terms of adding extra metadata or manipulating the file
          before upload.`}
        </p>
        <p className="mb-4">
          {`The complex approach with React Hook Form and base64 encoding offers more flexibility and control over the
          upload process. It allows you to easily include additional form fields and validate them before submission.
          However, it may not be suitable for very large files due to memory constraints and increased payload size.`}
        </p>
        <p>
          {`Choose the approach that best fits your specific use case, considering factors such as file size, additional
          data requirements, and client-side processing needs.`}
        </p>
      </div>
    </main>
  )
}


import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const App = () => {
  const [originalFile, setOriginalFile] = useState({
    name: "",
    size: "",
    width: "",
    height: "",
    url: "",
    file: "",
  });

  const [resizeImg, setResizeImg] = useState(null);

  const [formData, setFormData] = useState({
    height: "",
    width: "",
  })

  // HANDLE HEIGHT AND WIDTH INPUT
  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.height || formData.height.trim() === "") {
      return toast.error("Image Height Is Required")
    }

    if (!formData.width || formData.width.trim() === "") {
      return toast.error("Image Height Is Required")
    }

    handleResize();

  }

  // UPLOAD IMAGE
  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {

      const file = e.target.files[0];

      if (!file) {
        return toast.error("Image Is Required");
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image");
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {

        const base64 = fileReader.result;
        const img = new Image();

        img.onload = () => {
          setOriginalFile({
            name: file.name,
            size: file.size,
            width: img.naturalWidth,
            height: img.naturalHeight,
            url: base64,
            file,
          });
        };

        img.onerror = () => {
          toast.error("Failed to load image");
        };

        img.src = base64;

      };

      fileReader.onerror = () => {
        toast.error("Failed to read image");
      };

      fileReader.readAsDataURL(file);


    }

    input.click();

  }

  // RESIZE IMAGE
  const handleResize = () => {

    if (!originalFile.file) {
      return toast.error("Invalid Image Resize Request");
    }

    const width = Number(formData.width);
    const height = Number(formData.height);

    let image = new Image();
    const objectUrl = URL.createObjectURL(originalFile.file);

    image.onload = () => {
      try {

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return toast.error("Unable to resize image");
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(image, 0, 0, width, height);
        const imgString = canvas.toDataURL("image/png");

        setResizeImg(imgString);
        toast.success("Image resized successfully");

      } catch (err) {

        toast.error(err.message);

      } finally {
        URL.revokeObjectURL(objectUrl);
      }

    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error("Failed to load original image");
    };

    image.src = objectUrl;
  }

  // DOWNLOAD IMAGE
  const handleDownload = () => {

    if (!resizeImg) {
      return toast.error("Resize The Image First")
    }

    const a = document.createElement("a");
    a.href = resizeImg;
    a.download = "resized-image";
    a.click();
    a.remove();
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-700">

        <header className="fixed w-full z-50 top-0 left-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
                <i className="ri-crop-line" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">PixelResize</h1>
                <p className="text-xs font-medium text-slate-500">Image tools made simple</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Fast & Simple
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-[100px] lg:px-8">

          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
              <i className="ri-magic-line text-sm" />
              SIMPLE IMAGE RESIZER
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Resize images, <span className="text-blue-600">effortlessly.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              Get the perfect dimensions for your images in seconds. Upload, customize your size, and download your result.
            </p>
          </div>

          {/* UPLOAD SECTION */}
          {originalFile.url === "" &&
            <div className="mx-auto mb-8 max-w-4xl">

              <div className="group relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30 sm:p-10">

                <div className="flex flex-col items-center justify-center text-center">

                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-blue-100">
                    <i className="ri-upload-cloud-2-line text-4xl transition-transform duration-300 group-hover:-translate-y-1" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs text-white">
                      <i className="ri-add-line" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                    Upload your image
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Click to browse your files.
                  </p>
                  <div
                    onClick={handleUploadImage}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
                  >
                    <i className="ri-folder-open-line text-lg" />
                    Choose Image
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">Built By Sarfraj Shaikh</p>
                </div>
              </div>
            </div>
          }

          {/* RESIZE SECTION */}
          {originalFile.url !== "" &&
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

              {/* ORIGINAL IMAGE */}
              <section className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-600 transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <i className="ri-image-line" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">Original Image</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Your source file</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Original</span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-64">
                    <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                    <img src={originalFile.url || "https://img.magnific.com/free-vector/output_53876-25529.jpg"} alt={originalFile.name || "Original image preview"} className="relative z-10 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]" />
                    {!originalFile.url && <div className="absolute inset-x-0 bottom-3 z-20 mx-auto w-fit rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">Preview placeholder</div>}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-blue-600 shadow-sm ring-1 ring-slate-200/70">
                        <i className="ri-file-image-line" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{originalFile.name || "No image selected"}</p>
                        <p className="mt-1 text-xs text-slate-500">{(originalFile.size / (1024 * 1024)).toFixed(2) + " MB" || "File size unavailable"}</p>
                      </div>
                      <i className="ri-checkbox-circle-fill text-xl text-emerald-500" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">Height</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">{originalFile.height || "—"} <span className="text-xs font-medium text-slate-400">px</span></p>
                      </div>
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">Width</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">{originalFile.width || "—"} <span className="text-xs font-medium text-slate-400">px</span></p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <div className="mb-3">
                        <h4 className="text-sm font-bold text-slate-900">Resize dimensions</h4>
                        <p className="mt-1 text-xs text-slate-500">Enter your desired output dimensions.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="height" className="mb-2 block text-xs font-semibold text-slate-600">Height (px)</label>
                          <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300">
                            <i className="ri-height-line text-lg text-slate-400" />
                            <input id="height" name="height" type="text" value={formData.height} onChange={handleInput} placeholder="e.g. 1080" className="h-full min-w-0 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="width" className="mb-2 block text-xs font-semibold text-slate-600">Width (px)</label>
                          <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300">
                            <i className="ri-width-line text-lg text-slate-400" />
                            <input id="width" name="width" type="text" value={formData.width} onChange={handleInput} placeholder="e.g. 1920" className="h-full min-w-0 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="group/button flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:translate-y-0 active:scale-[0.99]">
                      <i className="ri-expand-diagonal-line text-lg transition-transform duration-300 group-hover/button:rotate-12" />
                      Resize Image
                      <i className="ri-arrow-right-line ml-1 text-lg transition-transform duration-300 group-hover/button:translate-x-1" />
                    </button>
                  </form>
                </div>
              </section>

              {/* RESIZED IMAGE */}
              <section className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-100">
                      <i className="ri-checkbox-multiple-line" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">Resized Image</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Your output preview</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Output</span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-64">
                    <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

                    {resizeImg ? (
                      <img
                        src={resizeImg}
                        alt="Resized image preview"
                        className="relative z-10 h-full w-full object-contain p-4"
                      />
                    ) : (
                      <p className="text-sm text-slate-400">
                        Your resized image will appear here
                      </p>
                    )}

                    <div className="absolute inset-x-0 bottom-3 z-20 mx-auto w-fit rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">Output preview</div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-emerald-600 shadow-sm ring-1 ring-slate-200/70">
                        <i className="ri-file-image-line" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{originalFile.name || "Resized image"}</p>
                        <p className="mt-1 text-xs text-slate-500">{(originalFile.size / (1024 * 1024)).toFixed(2) + " MB" || "Output size unavailable"}</p>
                      </div>
                      <i className="ri-checkbox-circle-fill text-xl text-emerald-500" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">Height</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">{formData.height || originalFile.height || "—"} <span className="text-xs font-medium text-slate-400">px</span></p>
                      </div>
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">Width</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">{formData.width || originalFile.width || "—"} <span className="text-xs font-medium text-slate-400">px</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-slate-900">Ready to download?</h4>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Your resized image will be available here once your resizing logic is connected.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-bold text-emerald-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/20 active:translate-y-0 active:scale-[0.99]"
                    >
                      <i className="ri-download-2-line text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />
                      Download Image
                    </button>
                  </div>
                </div>
              </section>
            </div>
          }

          <footer className="mt-10 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400">© 2026 PixelResize. Built by Sarfraj Shaikh.</p>
          </footer>
        </main>
      </div>
      <Toaster />
    </>
  )
}

export default App
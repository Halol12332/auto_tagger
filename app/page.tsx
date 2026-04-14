import ListingForm from '../components/ListingForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold tracking-wide mb-4 border border-indigo-100">
            Internal Prototype V2
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Tsunagu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Auto-Tagger</span>
          </h1>
          <p className="text-black text-lg max-w-xl mx-auto">
            Upload an item photo to instantly generate listing details using YOLOv8 computer vision.
          </p>
        </div>
      </div>
      
      <ListingForm />
    </main>
  );
}

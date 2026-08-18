function Hero(){
    return (
        <section className="flex flex-col items-center justify-start pt-50 min-h-screen bg-gray-100">
        <><div >
            <h1 className="mt-4 text-4xl font-bold text-gray-800">Welcome to HELIX</h1>
            <p className="mt-2 ml-8 text-lg text-gray-600">Your gateway to bioinformatics.</p>
        </div> <div className="grid grid-cols-[400px_auto] h-3px gap-8 mt-6">
                <textarea className="mt-6  rounded-lg border border-gray-300 p-4 text-gray-800" place-self-center="true" rows="1" placeholder="Paste your DNA sequence here..."></textarea>
                    <button className="mt-6 rounded-lg bg-orange-500 place-self-center px-4 py-2 text-white hover:bg-orange-600">
                        Analyze
                    </button>
        </div>
            </>
        </section>
    );
}

export default Hero;
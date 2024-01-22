
const Heading = ({ heading }: { heading: string }) => {
    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-700 px-4">
                {heading}
            </h1>
        </div>)
}

export default Heading
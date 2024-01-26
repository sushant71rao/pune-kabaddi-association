import { Button } from "../ui/button"
import Heading from "../Heading"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { Card, CardContent } from "../ui/card"
const News = () => {
    return (
        <MaxWidthWrapper className="max-w-screen-2xl">
            <Heading heading="News Room" />
            <div className="flex flex-wrap gap-4 items-center justify-center">
                {
                    [1, 2].map((item) => (
                        <Card key={item}>
                            <a

                                href="#"
                                className="flex flex-col items-center bg-white   md:flex-row  rounded-lg"
                            >
                                <img
                                    src="https://punekabaddiassociation.com/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-05-at-10.23.56-PM.jpeg"
                                    alt="Event"
                                    className="object-cover w-auto h-60  md:w-48 p-4 "
                                />
                                <CardContent>
                                    <div className="flex flex-col p-4 rounded-lg">
                                        <span className="text-sm text-gray-500  mb-4">
                                            Date: September 5, 2023
                                        </span>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                                            Junior Category/ कुमार गट
                                        </h5>
                                        <p className="mb-3 font-normal text-gray-700 ">
                                            Selection Trail 2023 :- Sub-Junior <br /> Selection Trail 2023
                                        </p>

                                        <Button
                                            variant="outline"
                                            className="mt-2 "
                                        >
                                            Read More
                                        </Button>
                                    </div>
                                </CardContent>
                            </a>
                        </Card>

                    ))
                }

            </div>
        </MaxWidthWrapper>

    )
}

export default News
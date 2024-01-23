import { Button } from "../ui/button"
import Heading from "../Heading"
import MaxWidthWrapper from '../MaxWidthWrapper'
import { Card, CardContent } from "../ui/card"


const Events = () => {
    return (
        <MaxWidthWrapper>
            <Heading heading="Our Events" />
            <div className="flex flex-wrap gap-4 items-center justify-center  w-full ">

                {[1, 2, 3].map((item) => (
                    <Card>
                        <a
                            key={item}
                            href="#"
                            className="max-w-80 flex flex-col bg-white overflow-hidden rounded-lg"
                        >
                            <img
                                src="https://www.prokabaddi.com/static-assets/waf-images/7a/92/89/16-9/24KAEXA24A.jpeg?v=2.16&w=600"
                                alt="Event"
                                className="object-cover pb-4 "
                            />
                            <CardContent>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400 ">
                                        September 5, 2023
                                    </span>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                                        Pro Kabaddi League
                                    </h5>


                                    <Button
                                        variant={"outline"}
                                        className="mt-2"

                                    >
                                        Know More
                                    </Button>
                                </div>
                            </CardContent>
                        </a>
                    </Card>

                ))}
            </div>
        </MaxWidthWrapper>
    )
}

export default Events
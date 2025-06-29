"use client"

import { useQuery } from "@tanstack/react-query"
import { getSingleNews, fetchAllNews } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface NewsItem {
    _id: string
    title: string
    subTitle: string
    description: string
    images: string[]
    createdAt: string
    updatedAt: string
}

export default function NewsDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const newsId = params.id as string

    const {
        data: newsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["news", newsId],
        queryFn: () => getSingleNews(newsId),
        enabled: !!newsId,
    })

    const { data: allNewsData } = useQuery({
        queryKey: ["all-news"],
        queryFn: fetchAllNews,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: newsData?.data?.title,
                    text: newsData?.data?.subTitle,
                    url: window.location.href,
                })
            } catch (error) {
                console.log("Error sharing:", error)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
        }
    }

    if (isLoading) {
        return (
            <div className="container px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 mb-4">Failed to load news article.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const news: NewsItem = newsData?.data
    const relatedNews = allNewsData?.data?.filter((item: NewsItem) => item._id !== newsId).slice(0, 3) || []

    if (!news) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground mb-4">News article not found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="container py-8 lg:py-20">
            {/* Article Header */}
            <div className="">
                <div className="mb-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(news.createdAt)}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{news.title}</h1>
                </div>

                {/* Hero Image */}
                {news.images && news.images.length > 0 && (
                    <div className="lg:aspect-[5/2] aspect-video relative mb-8 rounded-lg overflow-hidden">
                        <Image src={news.images[0]} alt={news.title} fill className="object-cover" priority />
                    </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div dangerouslySetInnerHTML={{ __html: news.description }} className="text-gray-700 leading-relaxed" />
                </div>

                {/* Related Articles */}
                {relatedNews.length > 0 && (
                    <div className="border-t pt-12">
                        <h2 className="text-2xl font-bold mb-8">May also interest you</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedNews.map((item: NewsItem) => (
                                <Link key={item._id} href={`/news/${item._id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <div className="aspect-video relative">
                                            <Image
                                                src={item.images[0] || "/placeholder.svg?height=200&width=300"}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

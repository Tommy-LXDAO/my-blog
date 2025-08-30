// 详情页，通过接口获取文章的markdown raw data，并转换为样式
export default function BlogPage({ params }: { params: { blogId: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Blog ID: {params.blogId}</h1>
      {/* Here you can fetch and display the blog content based on the blogId */}
    </div>
  );
}
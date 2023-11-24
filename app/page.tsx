import DOMPurify from 'isomorphic-dompurify';

interface Post {
  id: number;
  title: string;
  link: string;
  excerpt: string;
  date: string;
  titleCardUrl: string;
  authorName: string;
  authorLink: string;
  topic: string;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json');
  const json = await res.json();
  return json.map((post: any) => ({
    id: post.id,
    title: post.title.rendered,
    link: post.link,
    excerpt: post.excerpt.rendered,
    date: post.date,
    titleCardUrl: post.featured_media,
    authorName: post._embedded.author[0].name,
    authorLink: post._embedded.author[0].link,
    // Some posts don't have a topic. Try the first tag instead.
    topic:
      post._embedded['wp:term'].flat().find((t: any) => t.taxonomy === 'topic')?.name ||
      post._embedded['wp:term'].flat().find((t_1: any) => t_1.taxonomy === 'post_tag')?.name ||
      '',
  }));
}

function PostCard({ post }: { post: Post }) {
  const date = new Date(post.date);
  const dateString = `${date.getDate()} ${date.toLocaleDateString('default', {
    month: 'long',
  })} ${date.getFullYear()}`;

  return (
    <div className="p-card--highlighted post-card">
      <p className="p-card__content">{post.topic.toUpperCase()}</p>
      <hr />
      <img className="p-card__image" src={post.titleCardUrl} alt="" />
      <h3>
        <a href={post.link}>{post.title}</a>
      </h3>
      <p className="p-card__content">
        <em>
          By <a href={post.authorLink}>{post.authorName}</a> on {dateString}
        </em>
      </p>
      <hr />
      <div
        className="p-card__content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
      />
    </div>
  );
}

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main>
      <div className="row">
        {posts.map((post) => (
          <div className="col-4" key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </main>
  );
}

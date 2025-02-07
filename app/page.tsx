import Link from "next/link"

export default function Home() {
  return (
    <section className="flex flex-col items-center text-center py-20">
      <h1 className="text-5xl font-bold text-primary">Welcome to Sadie’s Handmades</h1>
      <p className="text-lg text-secondary mt-4">
        Handmade Slime & Crafts – Made with Love!
      </p>
     
      <Link href="/shop" passHref>
  <div className="mt-6">
 Shop Now
  </div>
</Link>
    </section>
  );
}

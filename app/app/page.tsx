import Link from "next/link";

export default function Home() {
  return (
    <>
      <header>
        <nav className="flex items-center justify-between p-4 bg-emerald-600 text-white">
          <div className="">
            <a href="/">JTasks</a>
          </div>

          <div>
            <ul className="flex gap-2">
              <li>
                <a href="/">Features</a>
              </li>
              <li>
                <a href="/">Pricing</a>
              </li>
              <li>
                <a href="/">Docs</a>
              </li>
            </ul>
          </div>

          <div className="bg-white text-emerald-600 p-2 rounded-sm hover:bg-emerald-400 hover:text-white">
            <a href="/">Login In</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="text-center">
          <p className="my-4 px-4 md:px-72 text-lg">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse,
            tempora illum voluptate ex, distinctio, harum sunt repudiandae
            impedit autem quibusdam nostrum quidem nihil aspernatur minima.
          </p>
          <Link
            className="p-4 bg-emerald-600 text-white rounded-small"
            href="/login"
          >
            Get Started
          </Link>
        </section>
      </main>

      <footer></footer>
    </>
  );
}

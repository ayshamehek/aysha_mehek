import { createFileRoute } from "@tanstack/react-router";
import Portfolio from "@/components/Portfolio";
import profileAsset from "@/assets/profile.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aysha Mehek — Data Analyst & Data Scientist" },
      { name: "description", content: "Aysha Mehek is a BCA graduate and Data Science Intern at MSDC Manipal, working with Python, SQL, machine learning, analytics and data visualization." },
      { property: "og:title", content: "Aysha Mehek — Data Analyst & Data Scientist" },
      { property: "og:description", content: "Explore Aysha Mehek's data science projects, experience and skills in Python, SQL, machine learning and analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(profileAsset.url.startsWith("https://") ? [
        { property: "og:image", content: profileAsset.url },
        { name: "twitter:image", content: profileAsset.url },
      ] : []),
    ],
  }),
  component: Index,
});

function Index() {
  return <Portfolio />;
}

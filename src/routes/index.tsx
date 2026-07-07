import { createFileRoute } from "@tanstack/react-router";
import Portfolio from "@/components/Portfolio";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Portfolio />;
}

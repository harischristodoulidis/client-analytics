import { useParams, Link } from "react-router";

export default function ClientDetailPage() {
  const { clientId } = useParams();
  return (
    <>
      <h2>Client Detail Page</h2>
      <p>{clientId}</p>
      <p>
        <Link to=".." relative="path">
          Back
        </Link>
      </p>
    </>
  );
}

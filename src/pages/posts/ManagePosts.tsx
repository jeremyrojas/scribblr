import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const MOCK_POSTS = [
  {
    id: 1,
    title: "Getting Started with SCRIBBLR",
    date: "2024-04-10",
    status: "published",
    author: "Admin",
  },
  {
    id: 2,
    title: "Draft Post Example",
    date: "2024-04-11",
    status: "draft",
    author: "Admin",
  },
];

export default function ManagePosts() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-semibold tracking-tight">Manage Posts</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_POSTS.map((post) => (
            <TableRow
              key={post.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </TableCell>
              <TableCell>{post.author}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
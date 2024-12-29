import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    email: "admin@scribblr.com",
    firstName: "John",
    lastName: "Doe",
    dateCreated: "2024-04-01",
  },
];

const MOCK_LOGIN_HISTORY = [
  {
    id: 1,
    username: "admin",
    loginDateTime: "2024-04-10 09:30:00",
  },
];

export default function Settings() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Admin Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Login History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Login Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LOGIN_HISTORY.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.username}</TableCell>
                <TableCell>{entry.loginDateTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
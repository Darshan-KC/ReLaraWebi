import AppLayout from "../components/layout/AppLayout";

<Route element={<AppLayout />}>
  <Route path="/" element={<Dashboard />} />
  <Route path="/chat" element={<Chat />} />
  <Route path="/profile" element={<Profile />} />
</Route>
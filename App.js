import { StatusBar } from 'expo-status-bar';
import CallScreen from './app/screens/call-screen';
import { ConnectionProvider } from './app/services/peer-connection';

export default function App() {
  return (
    <ConnectionProvider>
      <>
        <CallScreen />
        <StatusBar style="auto" />
      </>
    </ConnectionProvider>
  );
}

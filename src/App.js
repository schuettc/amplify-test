import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import VideoMeeting from './VideoMeeting';
import MeetingControlBar from './MeetingControlBar';
import awsExports from './aws-exports';
import { MeetingProvider } from 'amazon-chime-sdk-component-library-react';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

import {
  ContentLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';
const sourceLanguages = [];
Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const App = () => {
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentSession, setCurrentSession] = useState({});
  const [transcripts, setTranscripts] = useState([]);
  const [lines, setLine] = useState([]);
  const [transcribeStatus, setTranscribeStatus] = useState(false);
  const [translateStatus, setTranslateStatus] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [localMute, setLocalMute] = useState(false);
  const [microphoneStream, setMicrophoneStream] = useState();
  const [transcriptionClient, setTranscriptionClient] = useState();

  useEffect(() => {
    async function getAuth() {
      setCurrentSession(await Auth.currentSession());
      setCurrentCredentials(await Auth.currentUserCredentials());
      console.log(`authState: ${JSON.stringify(currentSession)}`);
      console.log(`currentCredentials: ${JSON.stringify(currentCredentials)}`);
    }
    getAuth();
  }, []);

  const formFields = {
    signUp: {
      email: {
        order: 1,
        isRequired: true,
      },
      name: {
        order: 2,
        isRequired: true,
      },
      password: {
        order: 3,
      },
      confirm_password: {
        order: 4,
      },
    },
  };

  return (
    <Authenticator loginMechanisms={['email']} formFields={formFields}>
      {({ signOut, user }) => (
        <MeetingProvider>
          <ContentLayout
            header={
              <SpaceBetween size='m'>
                <Header
                  className='ContentHeader'
                  variant='h2'
                  actions={
                    <Button variant='primary' onClick={signOut}>
                      Sign out
                    </Button>
                  }
                >
                  Amazon Chime SDK Meeting
                </Header>
              </SpaceBetween>
            }
          >
            <SpaceBetween direction='horizontal' size='xs'>
              <SpaceBetween direction='vertical' size='l'>
                <Container
                  className='MeetingContainer'
                  footer={
                    <MeetingControlBar
                      transcribeStatus={transcribeStatus}
                      setTranscribeStatus={setTranscribeStatus}
                      sourceLanguages={sourceLanguages}
                      sourceLanguage={sourceLanguage}
                      setSourceLanguage={setSourceLanguage}
                      setTranscripts={setTranscripts}
                      localMute={localMute}
                      setLocalMute={setLocalMute}
                    />
                  }
                >
                  <VideoMeeting
                    setLine={setLine}
                    setTranscribeStatus={setTranscribeStatus}
                    setTranslateStatus={setTranslateStatus}
                  />
                </Container>
              </SpaceBetween>
            </SpaceBetween>
          </ContentLayout>
        </MeetingProvider>
      )}
    </Authenticator>
  );
};

export default App;

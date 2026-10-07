/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {notificationService} from '../src/services/notificationService';
import App from '../App';

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  onTokenRefresh: jest.fn(() => jest.fn()),
}));

jest.mock('react-redux', () => ({
  Provider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));

jest.mock('../src/store', () => ({
  store: {},
}));

jest.mock('../src/services/notificationService', () => ({
  notificationService: {
    setup: jest.fn().mockResolvedValue(undefined),
    getDeviceToken: jest.fn().mockResolvedValue('test-token'),
    displayLocalNotification: jest.fn(),
  },
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
  expect(notificationService.setup).toHaveBeenCalled();
});

import React from 'react';
import { render, user, act } from 'test-utils';
import StatusBar from './StatusBar';

describe('StatusBar', () => {
  it('displays a statusbar with 1 item in publishing queue', async () => {
    const { store, findByText } = render(<StatusBar />);

    await act(async () => {
      await store.dispatch({
        type: 'feature/packaging/publish/MONITOR_JOB_STARTED',
        payload: {
          jobId: 'job-1',
          jobType: 'AccommodationOnly',
          jobData: [
            {
              key: 'approval-1',
              approvalId: 'approval-1',
              sourceMarketName: 'SM1',
              accommodationName: 'Las Palmas',
              roomTypes: ['Double'],
              status: 'PENDING'
            }
          ]
        }
      });
    });

    expect(await findByText(/publishing 1 of 1/i)).toBeInTheDocument();
  });
  it('displays success message when publishing job completed successfully', async () => {
    const { store, findByText } = render(<StatusBar />);

    await act(async () => {
      await store.dispatch({
        type: 'feature/packaging/publish/MONITOR_JOB_STARTED',
        payload: {
          jobId: 'job-1',
          jobType: 'accommodation_only',
          jobData: [
            {
              key: 'approval-1',
              approvalId: 'approval-1',
              sourceMarketName: 'SM1',
              accommodationName: 'Las Palmas',
              roomTypes: ['Double'],
              status: 'PENDING'
            }
          ]
        }
      });
    });

    const element = await findByText(/show list/i);
    user.click(element);

    await act(async () => {
      await store.dispatch({
        type: 'feature/packaging/publish/PUBLISHED',
        payload: {
          approvalId: 'approval-1'
        }
      });
    });

    expect(await findByText(/publish completed 1 of 1/i)).toBeInTheDocument();
  });

  it('displays failed message when publishing job failed', async () => {
    const { store, findByText } = render(<StatusBar />);

    await act(async () => {
      await store.dispatch({
        type: 'feature/packaging/publish/MONITOR_JOB_STARTED',
        payload: {
          jobId: 'job-1',
          jobType: 'accommodation_only',
          jobData: [
            {
              key: 'approval-1',
              approvalId: 'approval-1',
              sourceMarketName: 'SM1',
              accommodationName: 'Las Palmas',
              roomTypes: ['Double'],
              status: 'PENDING'
            }
          ]
        }
      });
    });

    const element = await findByText(/show list/i);
    user.click(element);

    await act(async () => {
      await store.dispatch({
        type: 'feature/packaging/publish/PUBLISHED',
        payload: {
          approvalId: 'approval-1',
          publishError: true
        }
      });
    });

    expect(await findByText(/^publish failed$/i)).toBeInTheDocument();
  });

  it('displays warning message when publishing job completed with errors', async () => {
    const { store, findByText } = render(<StatusBar></StatusBar>);

    await store.dispatch({
      type: 'feature/packaging/publish/MONITOR_JOB_STARTED',
      payload: {
        jobId: 'job-1',
        jobType: 'accommodation_only',
        jobData: [
          {
            key: 'approval-1',
            approvalId: 'approval-1',
            sourceMarketName: 'SM1',
            accommodationName: 'Las Palmas',
            roomTypes: ['Double'],
            status: 'PENDING'
          },
          {
            key: 'approval-2',
            approvalId: 'approval-2',
            sourceMarketName: 'SM1',
            accommodationName: 'Tres Ves',
            roomTypes: ['Single'],
            status: 'PENDING'
          }
        ]
      }
    });

    const element = await findByText(/show list/i);
    user.click(element);

    await store.dispatch({
      type: 'feature/packaging/publish/PUBLISHED',
      payload: {
        approvalId: 'approval-1'
      }
    });

    await store.dispatch({
      type: 'feature/packaging/publish/PUBLISHED',
      payload: {
        approvalId: 'approval-2',
        publishError: true
      }
    });

    expect(await findByText(/publish completed with errors/i)).toBeInTheDocument();
    expect(await findByText(/publish failed/i)).toBeInTheDocument();
  });
});

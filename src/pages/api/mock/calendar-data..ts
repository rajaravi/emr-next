import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = {
    events: [
      { id: '1', title: 'New Appointment', start: '2024-12-12T07:30:00', end: '2024-12-12T08:00:00', resourceId: '101', color: '#0A5EB050' },
      { id: '2', title: 'Review', start: '2024-12-12T08:00:00', end: '2024-12-12T08:20:00', resourceId: '102', color: '#FC8F5450' },
      { id: '3', title: 'Consultation', start: '2024-12-12T09:15:00', end: '2024-12-12T09:50:00', resourceId: '101', color: '#A7D47750' },
      { id: '4', title: 'Consultation', start: '2024-12-12T09:00:00', end: '2024-12-12T09:30:00', resourceId: '102', color: '#A7D47750' },
      { id: '5', title: 'Review', start: '2024-12-12T07:45:00', end: '2024-12-12T08:15:00', resourceId: '103', color: '#FC8F5450' },
      { id: '6', title: 'Followup', start: '2024-12-12T10:00:00', end: '2024-12-12T10:30:00', resourceId: '103', color: '#FFB20050' },
      {
        id: 'na1',
        title: 'Lunch Break',
        start: '2024-12-12T12:00:00',
        end: '2024-12-12T13:00:00',
        display: 'background',
        color: '#ffcccc', // Light red for "not available" blocks
        resourceId: '101',
      },
      {
        id: 'na2',
        title: 'Not Available',
        start: '2024-12-12T16:00:00',
        end: '2024-12-12T18:00:00',
        display: 'background',
        color: '#ffcccc',
        resourceId: '103',
      },
    ],
    resources: [
      { id: '101', title: 'Alice', color: 'blue' },
      { id: '102', title: 'Bob', color: 'green' },
      { id: '103', title: 'Martin', color: 'orange' }
    ]
  };

  res.status(200).json(data);
}

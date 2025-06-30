import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

export const Calendar: React.FC = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Portfolio Review Meeting',
      date: '2024-03-15',
      time: '10:00 AM',
      location: 'Conference Room A',
      attendees: 8,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Q2 Planning Session',
      date: '2024-03-18',
      time: '2:00 PM',
      location: 'Virtual',
      attendees: 15,
      type: 'planning'
    },
    {
      id: 3,
      title: 'Project Milestone: Mobile Platform',
      date: '2024-03-20',
      time: '9:00 AM',
      location: 'Engineering Lab',
      attendees: 12,
      type: 'milestone'
    },
    {
      id: 4,
      title: 'Budget Review Committee',
      date: '2024-03-22',
      time: '11:00 AM',
      location: 'Executive Boardroom',
      attendees: 6,
      type: 'review'
    },
    {
      id: 5,
      title: 'Risk Assessment Workshop',
      date: '2024-03-25',
      time: '1:00 PM',
      location: 'Training Room B',
      attendees: 20,
      type: 'workshop'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-green-100 text-green-800';
      case 'milestone': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'workshop': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar & Events</h1>
        <p className="text-gray-600">
          Track important dates, meetings, and project milestones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-900">Meetings</span>
                <span className="text-blue-700 font-bold">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Milestones</span>
                <span className="text-green-700 font-bold">5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-900">Reviews</span>
                <span className="text-purple-700 font-bold">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Schedule Meeting</div>
                <div className="text-sm text-gray-600">Create new calendar event</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Set Milestone</div>
                <div className="text-sm text-gray-600">Add project milestone</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Book Review</div>
                <div className="text-sm text-gray-600">Schedule project review</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
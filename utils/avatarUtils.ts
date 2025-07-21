/**
 * Utility functions for generating user avatars from event data
 */

export interface UserAvatar {
  type: 'initials' | 'email' | 'default' | 'image';
  value: string;
  displayName?: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  firstName?: string;
}

/**
 * Extract organizer information from Google Calendar event
 */
export const getOrganizerFromEvent = (event: any): { email?: string; name?: string; firstName?: string } | null => {
  // First, try to get from the organizer field (most reliable)
  if (event.organizer) {
    const firstName = event.organizer.displayName ? event.organizer.displayName.split(' ')[0] : null;
    return {
      email: event.organizer.email,
      name: event.organizer.displayName,
      firstName: firstName,
    };
  }

  // Second, try to get from creator field
  if (event.creator) {
    const firstName = event.creator.displayName ? event.creator.displayName.split(' ')[0] : null;
    return {
      email: event.creator.email,
      name: event.creator.displayName,
      firstName: firstName,
    };
  }

  // Third, look through attendees for the organizer
  if (event.attendees && Array.isArray(event.attendees)) {
    const organizer = event.attendees.find((attendee: any) => attendee.organizer);
    if (organizer) {
      const firstName = organizer.displayName ? organizer.displayName.split(' ')[0] : null;
      return {
        email: organizer.email,
        name: organizer.displayName,
        firstName: firstName,
      };
    }
  }

  return null;
};

/**
 * Extract email addresses from event description or other fields (fallback)
 */
export const extractEmailFromEvent = (event: any): string | null => {
  const searchText = `${event.description || ''} ${event.location || ''} ${event.summary || ''}`;
  
  // Look for email patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = searchText.match(emailRegex);
  
  // Return the first email found, excluding common system emails
  if (matches) {
    const filtered = matches.filter(email => 
      !email.includes('noreply') && 
      !email.includes('no-reply') &&
      !email.includes('calendar-notification')
    );
    return filtered[0] || null;
  }
  
  return null;
};

/**
 * Extract organizer name from event description or summary (fallback)
 */
export const extractOrganizerName = (event: any): string | null => {
  const description = event.description || '';
  const summary = event.summary || '';
  
  // Look for common patterns like "Hosted by", "Organizer:", etc.
  const patterns = [
    /(?:hosted by|organizer|organized by|presenter|speaker):\s*([^,\n.]+)/i,
    /(?:with|by)\s+([A-Z][a-z]+ [A-Z][a-z]+)/g, // Name patterns like "John Smith"
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern) || summary.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
};

/**
 * Generate initials from a name, email, or firstName
 */
export const generateInitials = (input: string, firstName?: string): string => {
  // If we have a firstName, just use the first letter of that
  if (firstName && firstName.length > 0) {
    return firstName[0].toUpperCase();
  }

  if (!input) return '?';
  
  // If it's an email, use the part before @
  if (input.includes('@')) {
    input = input.split('@')[0];
  }
  
  // Split by common separators and take first letter of each word
  const words = input.split(/[\s._-]+/).filter(word => word.length > 0);
  
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  
  // Take first letter of first and last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Generate an avatar object from event data (instant, synchronous)
 */
export const generateAvatarFromEvent = (event: any): UserAvatar => {
  // Get organizer info from Google Calendar data
  const organizer = getOrganizerFromEvent(event);
  
  if (organizer && organizer.email) {
    const initials = generateInitials(organizer.name || organizer.email, organizer.firstName);
    
    return {
      type: 'email',
      value: initials,
      displayName: organizer.name || organizer.email.split('@')[0],
      firstName: organizer.firstName,
      backgroundColor: '#4682B4', // Darker blue background (SteelBlue)
      textColor: '#FFFFFF',
    };
  }
  
  // Fallback: Try to extract email from description
  const email = extractEmailFromEvent(event);
  if (email) {
    return {
      type: 'email',
      value: generateInitials(email),
      displayName: email.split('@')[0],
      backgroundColor: '#4682B4', // Darker blue background (SteelBlue)
      textColor: '#FFFFFF',
    };
  }
  
  // Fallback: Try to extract organizer name from description
  const organizerName = extractOrganizerName(event);
  if (organizerName) {
    const firstName = organizerName.split(' ')[0];
    return {
      type: 'initials',
      value: generateInitials(organizerName, firstName),
      displayName: organizerName,
      firstName: firstName,
      backgroundColor: '#4682B4', // Darker blue background (SteelBlue)
      textColor: '#FFFFFF',
    };
  }
  
  // Final fallback: Use event summary
  const summary = event.summary || 'Event';
  return {
    type: 'default',
    value: generateInitials(summary),
    displayName: summary,
    backgroundColor: '#4682B4', // Darker blue background (SteelBlue)
    textColor: '#FFFFFF',
  };
}; 
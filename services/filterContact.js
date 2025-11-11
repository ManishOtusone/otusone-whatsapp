const filterContacts = (contacts) => {
    return contacts.filter((c) => {
      const seenWithinLastWeek = new Date(c.lastSeen) > Date.now() - 7 * 24 * 60 * 60 * 1000;
      return c.optedIn && seenWithinLastWeek;
    });
  };
  
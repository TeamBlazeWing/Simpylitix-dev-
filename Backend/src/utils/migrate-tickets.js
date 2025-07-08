const mongoose = require('mongoose');
const Event = require('../models/event.model');
const { connectDB } = require('../config/db');

/**
 * Migration script to update existing events with new ticket quantity structure
 * Run this once to migrate existing data
 */

async function migrateTicketQuantities() {
  try {
    console.log('🔄 Starting ticket quantity migration...');

    // Find all events that have tickets
    const events = await Event.find({
      tickets: { $exists: true, $ne: [] }
    });

    console.log(`📊 Found ${events.length} events with tickets`);

    let updatedCount = 0;

    for (const event of events) {
      let needsUpdate = false;

      // Check if any ticket needs migration (missing new fields)
      event.tickets.forEach(ticket => {
        if (!ticket.totalQuantity || !ticket.hasOwnProperty('availableQuantity')) {
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        // Update ticket structure
        event.tickets = event.tickets.map(ticket => ({
          name: ticket.name,
          price: ticket.price,
          totalQuantity: ticket.totalQuantity || ticket.quantity || 1,
          availableQuantity: ticket.availableQuantity !== undefined ? ticket.availableQuantity : (ticket.quantity || 1),
          soldQuantity: ticket.soldQuantity || 0
        }));

        await event.save();
        updatedCount++;
        console.log(`✅ Updated event: ${event.title} (${event.eventCode})`);
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} events`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for use in other files
module.exports = { migrateTicketQuantities };

// Run migration if this file is executed directly
if (require.main === module) {
  connectDB().then(() => {
    migrateTicketQuantities().then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    }).catch(error => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
  });
}

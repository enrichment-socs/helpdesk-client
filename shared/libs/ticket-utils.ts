import { addHours, getDay } from 'date-fns';
import { SessionUser } from '../../models/SessionUser';
import { Ticket } from '../../models/Ticket';
import { ROLES } from '../constants/roles';

export class TicketUtils {
  static calculateDueDate(deadlineHours) {
    const HOURS_IN_DAY = 24;
    const SUNDAY = 0;

    const deadlineDays = deadlineHours / HOURS_IN_DAY;
    const hoursLeft = deadlineHours % HOURS_IN_DAY;

    let dueDate = new Date();
    let addedHours = 0;

    for (let i = 1; i <= deadlineDays; i++) {
      dueDate = addHours(dueDate, HOURS_IN_DAY);
      if (getDay(dueDate) == SUNDAY) {
        dueDate = addHours(dueDate, HOURS_IN_DAY);
        addedHours += HOURS_IN_DAY;
      }
    }

    if (hoursLeft > 0) {
      dueDate = addHours(dueDate, hoursLeft);
      if (getDay(dueDate) == SUNDAY) {
        dueDate = addHours(dueDate, HOURS_IN_DAY);
        addedHours += HOURS_IN_DAY;
      }
    }

    dueDate.setSeconds(0);
    dueDate.setMinutes(0);

    return { dueDate, addedHours };
  }

  static isEligibleToManage(user: SessionUser, ticket: Ticket): boolean {
    if (user.roleName === ROLES.SUPER_ADMIN) return true;
    return user.roleName === ROLES.ADMIN && user.id === ticket.assignedTo.id;
  }
}

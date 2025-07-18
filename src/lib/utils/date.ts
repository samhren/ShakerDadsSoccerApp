export function formatRelativeDate(date: Date): string {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const gameDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	
	const diffTime = gameDate.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays === 0) {
		return 'Today';
	} else if (diffDays === 1) {
		return 'Tomorrow';
	} else if (diffDays === -1) {
		return 'Yesterday';
	} else if (diffDays > 1 && diffDays <= 7) {
		return date.toLocaleDateString('en-US', { weekday: 'long' });
	} else {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
}

export function formatTime(timeString: string): string {
	// Convert 24-hour time to 12-hour format
	const [hours, minutes] = timeString.split(':');
	const hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minutes} ${ampm}`;
}

export function formatDateTime(date: Date, time: string): string {
	const relativeDate = formatRelativeDate(date);
	const formattedTime = formatTime(time);
	return `${relativeDate} at ${formattedTime}`;
}
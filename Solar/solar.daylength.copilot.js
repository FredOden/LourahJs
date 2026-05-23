const T = (23*3600+26*60+11.618)/3600;
const A = 365.2425;

function getSolarTime(latitude, longitude, date) {
    //const date = new Date();
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const B = (360 / A) * (dayOfYear - 81);
    const E = 9.87 * Math.sin(2 * B * Math.PI / 180) - 7.53 * Math.cos(B * Math.PI / 180) - 1.5 * Math.sin(B * Math.PI / 180);
    const timeOffset = E + 4 * longitude - 60 * date.getTimezoneOffset() / 60;
    const solarTime = new Date(date.getTime() + timeOffset * 60000);
    return solarTime.toLocaleTimeString();
}

// Exemple d'utilisation
/*
const latitude = 45.0; // Remplacez par la latitude souhaitée
const longitude = 5.0; // Remplacez par la longitude souhaitée
console.log(`Heure solaire vraie: ${getSolarTime(latitude, longitude)}`);
*/

function calculateDayLength(date, latitude) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const toDegrees = (radians) => radians * (180 / Math.PI);

    const dayOfYear = (date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const declination = (day) => {
        return T * Math.sin(toRadians((360 / A) * (day - 81)));
    };

    const hourAngle = (latitude, declination) => {
        return toDegrees(Math.acos(-Math.tan(toRadians(latitude)) * Math.tan(toRadians(declination))));
    };

    const dayLength = (latitude, day) => {
        const decl = declination(day);
        const ha = hourAngle(latitude, decl);
        return (2 * ha) / 15; // Convert hour angle to hours
    };

    const day = dayOfYear(date);
    return dayLength(latitude, day);
}

// Exemple d'utilisation
const date = new Date('2024-10-20');
const latitude = 40.0; // Latitude pour Saint-Denis-d'Oléron, France
console.log(`La durée du jour est de ${calculateDayLength(date, latitude).toFixed(2)} heures.`);

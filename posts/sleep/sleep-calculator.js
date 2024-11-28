document.addEventListener('DOMContentLoaded', function() {
    const ageInput = document.getElementById('age');
    const lifespanInput = document.getElementById('expected-lifespan');
    const sleepTimeInput = document.getElementById('sleep-time');
    const desiredSleepSlider = document.getElementById('desired-sleep');
    const sliderContainer = document.getElementById('slider-container');
    const resultContainer = document.getElementById('result');
    const yearsGainedSpan = document.getElementById('years-gained');
    const sliderValueSpan = document.getElementById('slider-value');

    function calculateYearsGained() {
        const age = parseFloat(ageInput.value);
        const lifespan = parseFloat(lifespanInput.value);
        const currentSleep = parseFloat(sleepTimeInput.value);
        const desiredSleep = parseFloat(desiredSleepSlider.value);
        
        if (!isNaN(age) && !isNaN(lifespan) && !isNaN(currentSleep) && !isNaN(desiredSleep)) {
            const hoursGainedPerDay = currentSleep - desiredSleep;
            const daysInYear = 365.25; // accounting for leap years
            const yearsRemaining = lifespan - age; // using custom lifespan
            
            // Convert hours gained per day to years
            const yearsGained = (hoursGainedPerDay * daysInYear * yearsRemaining) / (24 * daysInYear);
            
            yearsGainedSpan.textContent = yearsGained.toFixed(1);
            sliderValueSpan.textContent = desiredSleep;
        }
    }

    function updateSlider() {
        const currentSleep = parseFloat(sleepTimeInput.value);
        
        if (!isNaN(currentSleep)) {
            desiredSleepSlider.min = 0;
            desiredSleepSlider.max = currentSleep;
            desiredSleepSlider.value = currentSleep;
            sliderValueSpan.textContent = currentSleep;
            calculateYearsGained();
        }
    }

    // Initialize with default values
    function initializeCalculator() {
        updateSlider();
        calculateYearsGained();
    }

    // Event listeners
    ageInput.addEventListener('input', calculateYearsGained);
    lifespanInput.addEventListener('input', calculateYearsGained);
    sleepTimeInput.addEventListener('input', updateSlider);
    desiredSleepSlider.addEventListener('input', calculateYearsGained);

    // Initialize on page load
    initializeCalculator();
});
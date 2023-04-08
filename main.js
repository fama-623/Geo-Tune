      // Create a new AudioContext object
      const audioContext = new AudioContext();

      // Get all drum buttons
      const drumButtons = document.querySelectorAll(".drum-button");

      // Get the coordinates element
      const coordinates = document.getElementById("coordinates");
      const note = document.getElementById("note");

      // Function to play a single note
      const playNote = (digit) => {
        // Create a new OscillatorNode object
        const oscillator = audioContext.createOscillator();

        // Generate a frequency based on the digit value
        const frequency = 200 + digit * 100;

        // Set the oscillator frequency to the calculated frequency
        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );

        // Set the oscillator type to a random waveform (sine, square, sawtooth, or triangle)
        const waveform = ["sine"][Math.floor(Math.random() * 1)];
        oscillator.type = waveform;

        // Add an envelope to the sound to shape its amplitude over time
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.8,
          audioContext.currentTime + 0.05
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.2
        );
        gainNode.connect(audioContext.destination);
        oscillator.connect(gainNode);

        // Start the oscillator
        oscillator.start();

        // Stop the oscillator and disconnect nodes after 1 second
        setTimeout(() => {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        }, 500);
      };

      // Function to play a melody based on an array of digits
      const playMelody = (digits) => {
        // Loop through each digit and play a note based on its value
        digits.forEach((digit, index) => {
          // Delay playing each note by 0.5 seconds
          setTimeout(() => {
            note.textContent = `${digit}`;
            playNote(digit);
          }, index * 200);
        });
      };

      // Event listener for drum buttons
      drumButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Get user's current position and display coordinates
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              coordinates.textContent = `Latitude : ${latitude.toFixed(
                8
              )}, Longitude: ${longitude.toFixed(8)}`;
              // Play a melody based on the latitude and longitude digits
              const latitudeDigits = String(latitude.toFixed(8)).match(/\d/g);
              const longitudeDigits = String(longitude.toFixed(8)).match(/\d/g);
              const digits = [...latitudeDigits, ...longitudeDigits];
              playMelody(digits);
            });
          } else {
            // If geolocation is not supported, play a default melody
            const digits = [1, 2, 3, 4, 5];
            playMelody(digits);
          }
        });
      });

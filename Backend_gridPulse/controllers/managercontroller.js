
/*import Attendant from '../models/attendant.js';
import { fetchTemperature } from '../utils/temperature.js';
import substation from '../models/substation.js';

export const createSubstation = async (req, res) => {
  const { substationName, location, attendantEmail } = req.body;

  if (!substationName || !location || !attendantEmail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const attendant = await Attendant.findOne({ email: attendantEmail.toLowerCase() });

    if (!attendant) {
      return res.status(404).json({ message: 'Attendant not found. Register attendant first.' });
    }

    attendant.substation = substationName.toLowerCase();
    await attendant.save();

    const temperature = await fetchTemperature(location);
    const now = new Date(); 

    const newLocation = new substation({
        substation: substationName.toLowerCase(),
        attendantEmail: attendantEmail.toLowerCase(),
        location,
        temperature,
        Date: now.toLocaleDateString(),
        Time: now.toLocaleTimeString()
      });
      
      await newLocation.save();
      
     return res.status(201).json({ message: 'Substation created and attendant assigned successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
*/
export const getFormattedDuration = (ms) => {
  const hours = Math.floor(ms / 3600000); // 1 hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000); // 1 minute = 60000 ms

  let formattedDuration = "";

  if (hours > 0) {
    formattedDuration += `${hours} hr`;
    if (hours > 1) {
      formattedDuration += "s"; 
    }
  }

  if (minutes > 0) {
    if (formattedDuration !== "") {
      formattedDuration += " "; 
    }
    formattedDuration += `${minutes} min`;
    if (minutes > 1) {
      formattedDuration += "s"; 
    }
  }

  if (formattedDuration === "") {
    formattedDuration = "0 min";
  }

  return formattedDuration;
};

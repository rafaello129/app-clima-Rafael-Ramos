
export const getWeatherRecommendation = (weatherId: number): string => {
    if (weatherId >= 200 && weatherId < 300) {
      return '¡Tormenta eléctrica! Un buen día para quedarse en casa y ver una película.';
    }
    if (weatherId >= 300 && weatherId < 400) {
      return 'Hay llovizna. Un paraguas ligero será suficiente si necesitas salir.';
    }
    if (weatherId >= 500 && weatherId < 600) {
      if (weatherId === 500) return 'Lluvia ligera. No olvides un impermeable.';
      return '¡Está lloviendo! Asegúrate de llevar paraguas y botas de agua.';
    }
    if (weatherId >= 600 && weatherId < 700) {
      return '¡Está nevando! Hora de abrigarse bien y disfrutar de un chocolate caliente.';
    }
    if (weatherId >= 700 && weatherId < 800) {
      return 'Hay niebla o bruma. Conduce con precaución, la visibilidad es reducida.';
    }
    if (weatherId === 800) {
      return '¡Cielo despejado! Es un día perfecto para una caminata o un picnic.';
    }
    if (weatherId > 800 && weatherId < 900) {
      if (weatherId === 801 || weatherId === 802) return 'Parcialmente nublado. Ideal para actividades al aire libre sin tanto sol.';
      return 'El cielo está muy nublado. Un buen momento para visitar un museo o una cafetería.';
    }
  
    return 'Disfruta tu día, sin importar el clima.';
  };
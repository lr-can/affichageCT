function convertirDate(chaineDate) {
  // Diviser la chaîne en parties (jour, mois, année)
  var partiesDate = chaineDate.split('/');
  
  // Récupérer les parties individuelles
  var jour = parseInt(partiesDate[0], 10);
  var mois = parseInt(partiesDate[1], 10) - 1; // Les mois dans JavaScript commencent à 0
  var annee = parseInt(partiesDate[2], 10);
  
  // Créer un objet Date avec les parties extraites
  var dateObj = new Date(annee, mois, jour);

  return dateObj;
}
    function processNotificationData(data) {
    data.forEach((row) => {
      if (row.notification.startsWith("🚧")) {
        var numeroInter = row.numeroInter;
        var notificationDate = row.notificationDate;
        var notificationHeure = row.notificationHeure;
        var notificationTitre = row.notificationTitre;
        var notificationLon = row.notificationLon;
        var notificationLat = row.notificationLat;
        var notificationEngins = row.notificationEngins;
        var notificationVille = row.notificationVille;
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('backgroundImage').setAttribute("src", `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=900&height=150&center=lonlat:${notificationLon},${notificationLat}&zoom=13&marker=lonlat:${notificationLon},${notificationLat};type:circle;color:%23ff0000;size:xx-large;icon:sos;icontype:material;iconsize:small;strokecolor:%23ff0000&scaleFactor=2&apiKey=75c6e5ac06e84d3a95473195e7af529d`)
        document.getElementById('dateDerniereInter').innerHTML = notificationDate;
        var notificationDate = convertirDate(notificationDate);
        var notificationDate = notificationDate.toLocaleDateString('fr-FR', options);
        document.getElementById('dateDerniereInter2').innerHTML = notificationDate;
        document.getElementById('heureInter').innerHTML = notificationHeure;
        document.getElementById('motifInter').innerHTML = notificationTitre.toUpperCase();
        document.getElementById('numeroInter').innerHTML = numeroInter;
        document.getElementById('communeInter').innerHTML = notificationVille;
    }
      });
    };
    function GetnombreEngins(data){
      data.forEach((row) => {
        if (row.notification.startsWith("🚧")) {
        var nombreEngin = row.notificationEngins;
        if (nombreEngin == 1){
          document.getElementById('nombreEnginsEngages').innerHTML = nombreEngin + " engin a";
          document.getElementById('Enginpluriel').innerHTML = "engagé";
          console.log('condition ici');
        } else if (nombreEngin == 0){
          document.getElementById('nombreEnginsEngages').innerHTML = 'aucun';
          document.getElementById('nombreEnginsEngages').innerHTML = nombreEngin  + " engin a";
          document.getElementById('Enginpluriel').innerHTML = "engagé";
          console.log('condition là');
        } else {
          document.getElementById('nombreEnginsEngages').innerHTML = nombreEngin  + " engins ont";
          document.getElementById('Enginpluriel').innerHTML = "engagés";
          console.log('condition par là ');

        };
      };
      });
    };
    function processAlertData(data){
      data.forEach((row) => {
        if (row.notification.startsWith("⚠")) {
          var CODISnotification = row.notification.replace('⚠ ', '');
          console.log(CODISnotification);
          var CODISDate = row.notificationDate;
          console.log(CODISDate);
          var CODISendDate = convertirDate(CODISDate);
          console.log(CODISendDate);
          CODISendDate.setDate(CODISendDate.getDate() + 7);
          var CODISheure = row.notificationHeure;
          console.log(CODISendDate.getDate());

          var yesterday = new Date();
          console.log(yesterday.getDate());
          if (CODISendDate >= yesterday) {
            console.log('True');
            document.getElementById("CODISMessage").innerHTML = `<div>${CODISnotification}<div>`;
            document.getElementById("CODISMessage").className = "WarningCODIS";
            document.getElementById("AlertStatut").innerHTML = "Consigne publiée sur ARTEMIS";
            console.log('Done');
          }
        };
      })
    }
      function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(date);
      }
      async function getEquipeGardeForDate(targetDate) {
    try {
      // Faire la requête fetch
      const response = await fetch("https://opensheet.elk.sh/1zFKFK_tlFQD3_Y6JkgRYm_E0THA6AVkYGYJjMpM8DPY/Feuille%201");
      const data = await response.json();

      // Rechercher l'équipe de garde pour la date donnée
      const targetGarde = data.find(entry => entry.Date === targetDate);

      return targetGarde ? targetGarde.equipeGarde : null;

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return null;
    }
  }
  async function getEquipeGarde() {
    try {
      // Récupérer la date actuelle au format souhaité
      const currentDate = new Date();
      const currentDateString = formatDate(currentDate);

      // Récupérer l'équipe de garde pour la date actuelle
      const currentGarde = await getEquipeGardeForDate(currentDateString);

      if (currentGarde) {
        // Mettre à jour le contenu du span avec l'équipe de garde actuelle
        const currentShiftSpan = document.getElementById('currentShift');
        currentShiftSpan.textContent = `${currentGarde}`;
        currentShiftSpan.className = `equipe${currentGarde}`;

        // Récupérer l'équipe de garde pour la date qui succède (1 jour après)
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateString = formatDate(nextDate);
        console.log('la date est' + nextDateString);

        const nextGarde = await getEquipeGardeForDate(nextDateString);
        const options2 = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

        if (nextGarde != currentGarde) {
          // Mettre à jour le contenu du span avec l'équipe de garde qui succède
          const nextShiftSpan = document.getElementById('nextShift');
          nextShiftSpan.textContent = `${nextGarde}`;
          nextShiftSpan.className = `equipe${nextGarde}`;
          document.getElementById('dateNextShift').innerHTML = nextDate.toLocaleDateString('fr-FR', options2);
        } else {
          console.log(`Aucune information trouvée pour la date ${nextDateString}`);

          const nextDate2 = new Date(currentDate);
          nextDate2.setDate(nextDate2.getDate() + 2);
          const nextDateString2 = formatDate(nextDate2);
          const nextGarde2 = await getEquipeGardeForDate(nextDateString2);
          console.log(nextGarde2);
          if (nextGarde2 != currentGarde) {
            console.log('condition remplie ici');
            document.getElementById('nextShift').textContent = `${nextGarde2}`;
            document.getElementById('nextShift').className = `equipe${nextGarde2}`;
            document.getElementById('dateNextShift').innerHTML = nextDate2.toLocaleDateString('fr-FR', options2);
          } else {
            const nextDate3 = new Date(currentDate);
            nextDate3.setDate(nextDate3.getDate() + 3);
            const nextDateString3 = formatDate(nextDate3);
            const nextGarde3 = await getEquipeGardeForDate(nextDateString3);
            if (nextGarde3 != currentGarde) {
            document.getElementById('nextShift').textContent = `${nextGarde3}`;
            document.getElementById('nextShift').className = `equipe${nextGarde3}`;
            document.getElementById('dateNextShift').innerHTML = nextDate3.toLocaleDateString('fr-FR', options2);
          }
        }
        }

      } else {
        console.log(`Aucune information trouvée pour la date ${currentDateString}`);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }
  async function getNextEvents() {
    try {
      // Récupérer la date actuelle au format souhaité
      const currentDate = new Date();
      const currentDateString = formatDate(currentDate);

      // Faire la requête fetch
      const response = await fetch("https://opensheet.elk.sh/1zFKFK_tlFQD3_Y6JkgRYm_E0THA6AVkYGYJjMpM8DPY/Feuille%201");
      const data = await response.json();

      // Filtrer les événements dont la date est supérieure ou égale à la date actuelle
      const futureEvents = data.filter(entry => convertirDate(entry.Date) >= currentDate && entry.evenementNom);

      // Trier les événements par date croissante
      const sortedEvents = futureEvents;
      console.log(sortedEvents);

      // Afficher les trois prochains événements dans les spans correspondants
      for (let i = 0; i < 3; i++) {
        console.log(sortedEvents[i].evenementNom);

        var eventSpan = document.getElementById(`nextEvent${i.toString()}`);
        var eventDateSpan = document.getElementById(`nextEventDate${i.toString()}`);

        if (sortedEvents[i]) {
          
          eventSpan.innerHTML = sortedEvents[i].evenementNom;
          eventDateSpan.innerHTML = sortedEvents[i].Date;
        
      }
    }

    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  }
  async function getNextAnnivs() {
    try {
      // Récupérer la date actuelle au format souhaité
      const currentDate = new Date();
      const currentDateString = formatDate(currentDate);

      // Faire la requête fetch
      const response = await fetch("https://opensheet.elk.sh/1zFKFK_tlFQD3_Y6JkgRYm_E0THA6AVkYGYJjMpM8DPY/Feuille%201");
      const data = await response.json();

      // Filtrer les événements dont la date est supérieure ou égale à la date actuelle
      const futureEvents = data.filter(entry => convertirDate(entry.Date) >= currentDate && entry.anniversaire);

      // Trier les événements par date croissante
      const sortedEvents = futureEvents.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      console.log(sortedEvents);

      // Afficher les trois prochains événements dans les spans correspondants
      for (let i = 0; i < 3; i++) {
        console.log(sortedEvents[i]);

        var eventSpan = document.getElementById(`nextAnniv${i.toString()}`);
        var eventDateSpan = document.getElementById(`nextAnnivDate${i.toString()}`);

        if (sortedEvents[i]) {
          
          eventSpan.innerHTML = sortedEvents[i].anniversaire;
          eventDateSpan.innerHTML = sortedEvents[i].Date;
        
      }
    }

    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  }
  async function getNextMeeting() {
    try {
      // Récupérer la date actuelle au format souhaité
      const currentDate = new Date();
      const currentDateString = formatDate(currentDate);

      // Faire la requête fetch
      const response = await fetch("https://opensheet.elk.sh/1zFKFK_tlFQD3_Y6JkgRYm_E0THA6AVkYGYJjMpM8DPY/Feuille%201");
      const data = await response.json();

      // Filtrer les événements dont la date est supérieure ou égale à la date actuelle
      const futureEvents = data.filter(entry => convertirDate(entry.Date) >= currentDate && entry.réunion == 'oui');

      // Trier les événements par date croissante
      const sortedEvents = futureEvents.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      console.log(sortedEvents);
      const options2 = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

      var MeetingDate = convertirDate(sortedEvents[0].Date);

      // Afficher les trois prochains événements dans les spans correspondants
        var eventSpan = document.getElementById(`nextMeeting`);
       
                
        eventSpan.innerHTML = MeetingDate.toLocaleDateString('fr-FR', options2);
        

    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  }
  getEquipeGarde();
  getNextEvents();
  getNextAnnivs();
  getNextMeeting();
        setInterval(function() {
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        const frenchDate = today.toLocaleDateString('fr-FR', options);
        document.getElementById('todayDate').innerHTML = frenchDate;
        const timeNow = new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
document.getElementById('timeNow').innerHTML = timeNow;
        const options2 = {year: 'numeric', month: 'long', day: 'numeric' };
        const today2 = new Date();
}, 15);

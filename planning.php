
<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=airbnb_clone;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Erreur BDD : " . $e->getMessage());
}

$stmt = $pdo->query('SELECT * FROM tasks ORDER BY deadline ASC');
$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total = count($tasks);
$byStatus = ['À faire'=>0,'En cours'=>0,'Terminé'=>0];
$byPriority = ['Haute'=>0,'Moyenne'=>0,'Faible'=>0];
$completedOverTime = [];
foreach ($tasks as $t) {
    $byStatus[$t['status']]++;
    $byPriority[$t['priority']]++;
    if ($t['status']==='Terminé') {
        $day = $t['end_date'] ?? $t['deadline'];
        if (!isset($completedOverTime[$day])) $completedOverTime[$day]=0;
        $completedOverTime[$day]++;
    }
}
ksort($completedOverTime);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard Planning</title>
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" rel="stylesheet">
  <link href="assets/style.css" rel="stylesheet">
</head>
<body>
  <div class="sidebar">
    <h2>Mon Projet</h2>
    <ul>
      <li class="active"><i class="fas fa-chart-line"></i> Dashboard</li>
      <li><i class="fas fa-tasks"></i> Tâches</li>
      <li><i class="fas fa-comments"></i> Messages</li>
      <li><i class="fas fa-cog"></i> Paramètres</li>
    </ul>
  </div>
  <div class="main">
    <header>
      <h1>Dashboard</h1>
    </header>
    <section class="stats">
      <div class="card small-card">
        <h3>Total Tâches</h3>
        <p><?php echo $total; ?></p>
      </div>
      <div class="card small-card">
        <h3>À faire</h3>
        <p><?php echo $byStatus['À faire']; ?></p>
      </div>
      <div class="card small-card">
        <h3>En cours</h3>
        <p><?php echo $byStatus['En cours']; ?></p>
      </div>
      <div class="card small-card">
        <h3>Terminé</h3>
        <p><?php echo $byStatus['Terminé']; ?></p>
      </div>
    </section>
    <section class="content">
      <div class="left-panel">
        <div class="chart-card">
          <canvas id="statusChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="priorityChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="evolutionChart"></canvas>
        </div>
      </div>
      <div class="right-panel">
        <div class="calendar-card">
          <div id="calendar"></div>
        </div>
        <div class="tasks-table-card">
          <table>
            <thead>
              <tr>
                <th>Titre</th><th>Priorité</th><th>Statut</th><th>Deadline</th><th>Progression</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach($tasks as $t): ?>
              <tr>
                <td><?php echo htmlspecialchars($t['title']); ?></td>
                <td><span class="tag <?php echo strtolower($t['priority']); ?>"><?php echo $t['priority']; ?></span></td>
                <td><span class="status <?php echo strtolower(str_replace(' ','_',$t['status'])); ?>"><?php echo $t['status']; ?></span></td>
                <td><?php echo $t['deadline']; ?></td>
                <td><progress value="<?php echo $t['progress']; ?>" max="100"></progress> <?php echo $t['progress']; ?>%</td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js"></script>
  <script>
    const tasks = <?php echo json_encode($tasks); ?>;
    document.addEventListener('DOMContentLoaded', () => {
      const calendarEl = document.getElementById('calendar');
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {left:'prev,next today',center:'title',right:'dayGridMonth,timeGridWeek'},
        events: tasks.map(t=>({title:t.title,start:t.start_date,end:t.end_date,color:'#4e5ae8'}))
      }); calendar.render();

      const statusCtx = document.getElementById('statusChart');
      new Chart(statusCtx,{type:'doughnut',data:{labels:<?php echo json_encode(array_keys($byStatus)); ?>,datasets:[{data:<?php echo json_encode(array_values($byStatus)); ?>,backgroundColor:['#e74c3c','#f39c12','#2ecc71']}]} });

      const priorityCtx = document.getElementById('priorityChart');
      new Chart(priorityCtx,{type:'bar',data:{labels:<?php echo json_encode(array_keys($byPriority)); ?>,datasets:[{label:'Tâches',data:<?php echo json_encode(array_values($byPriority)); ?>,backgroundColor:'#4e5ae8'}]},options:{scales:{y:{beginAtZero:true}}}});

      const evoCtx = document.getElementById('evolutionChart');
      new Chart(evoCtx,{type:'line',data:{labels:<?php echo json_encode(array_keys($completedOverTime)); ?>,datasets:[{label:'Tâches terminées',data:<?php echo json_encode(array_values($completedOverTime)); ?>,fill:false,borderColor:'#e67e22'}]},options:{scales:{y:{beginAtZero:true}}}});
    });
  </script>
</body>
</html>

<style>
:root{--bg:#14141f;--bg-sidebar:#1f1f2e;--bg-panel:#1a1a27;--accent:#4e5ae8;--text:#e0e0e0;--text-muted:#888;}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif;}
body{display:flex;min-height:100vh;color:var(--text);background:var(--bg);}
.sidebar{width:240px;background:var(--bg-sidebar);padding:2rem;}
.sidebar h2{color:var(--accent);margin-bottom:2rem;text-transform:uppercase;letter-spacing:1px;}
.sidebar ul{list-style:none;}
.sidebar li{padding:0.8rem 1rem;border-radius:0.5rem;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:0.5rem;}
.sidebar li.active, .sidebar li:hover{background:var(--accent);color:#fff;}
.main{flex:1;display:flex;flex-direction:column;}
header{padding:1.5rem;background:var(--bg-panel);border-bottom:1px solid #333;}
header h1{color:var(--text);}
.stats{display:flex;gap:1rem;padding:1.5rem;background:var(--bg-panel);}
.small-card{flex:1;background:var(--bg-panel);padding:1rem;border-radius:1rem;text-align:center;}
.small-card h3{margin-bottom:0.5rem;font-size:1rem;color:var(--text-muted);}
.small-card p{font-size:1.5rem;font-weight:bold;}
.content{display:flex;flex:1;overflow:hidden;}
.left-panel{flex:1;display:flex;flex-direction:column;gap:1rem;padding:1.5rem;overflow-y:auto;background:var(--bg);}
.right-panel{width:500px;display:flex;flex-direction:column;gap:1rem;padding:1.5rem;background:var(--bg-sidebar);}
.chart-card, .calendar-card, .tasks-table-card{background:var(--bg-panel);border-radius:1rem;padding:1rem;}
.calendar-card{flex:1;}
.tasks-table-card table{width:100%;border-collapse:collapse;color:var(--text);}
.tasks-table-card th, .tasks-table-card td{padding:0.5rem;text-align:left;border-bottom:1px solid #333;}
.tag.haute{background:#e74c3c;color:#fff;padding:0.2rem 0.5rem;border-radius:0.3rem;}
.tag.moyenne{background:#f39c12;color:#fff;padding:0.2rem 0.5rem;border-radius:0.3rem;}
.tag.faible{background:#2ecc71;color:#fff;padding:0.2rem 0.5rem;border-radius:0.3rem;}
.status.à_faire{color:#e74c3c;font-weight:bold;}
.status.en_cours{color:#f39c12;font-weight:bold;}
.status.terminé{color:#2ecc71;font-weight:bold;}
</style>
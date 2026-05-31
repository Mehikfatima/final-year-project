<?php
include "db.php";

$sql = "SELECT * FROM custom_tour_requests ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Custom Tour Requests</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f7fb; padding: 25px; color: #1f2937; }
    h1 { text-align: center; color: #e05528; }
    .wrap { overflow-x: auto; background: #fff; padding: 20px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
    table { width: 100%; border-collapse: collapse; min-width: 1100px; }
    th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 14px; vertical-align: top; }
    th { background: #9fbd21; color: white; }
    tr:nth-child(even) { background: #f9fafb; }
    .empty { text-align: center; background: #fff7ed; color: #9a3412; padding: 20px; border-radius: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Custom Tour Requests</h1>

  <div class="wrap">
    <?php if (mysqli_num_rows($result) > 0) { ?>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>From City</th>
            <th>Destination</th>
            <th>Budget</th>
            <th>Travelers</th>
            <th>Duration</th>
            <th>Vehicle</th>
            <th>Hotel</th>
            <th>Food</th>
            <th>Note</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php while ($row = mysqli_fetch_assoc($result)) { ?>
            <tr>
              <td><?php echo htmlspecialchars($row["id"]); ?></td>
              <td><?php echo htmlspecialchars($row["name"]); ?></td>
              <td><?php echo htmlspecialchars($row["phone"]); ?></td>
              <td><?php echo htmlspecialchars($row["from_city"]); ?></td>
              <td><?php echo htmlspecialchars($row["destination"]); ?></td>
              <td><?php echo htmlspecialchars($row["budget"]); ?></td>
              <td><?php echo htmlspecialchars($row["travelers"]); ?></td>
              <td><?php echo htmlspecialchars($row["duration"]); ?></td>
              <td><?php echo htmlspecialchars($row["vehicle"]); ?></td>
              <td><?php echo htmlspecialchars($row["hotel"]); ?></td>
              <td><?php echo htmlspecialchars($row["food"]); ?></td>
              <td><?php echo htmlspecialchars($row["note"]); ?></td>
              <td><?php echo htmlspecialchars($row["created_at"]); ?></td>
            </tr>
          <?php } ?>
        </tbody>
      </table>
    <?php } else { ?>
      <div class="empty">Abhi koi custom tour request submit nahi hui.</div>
    <?php } ?>
  </div>
</body>
</html>
<?php mysqli_close($conn); ?>

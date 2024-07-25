<?php
// Include the connect.php file
include('connect.php');
?>
<!DOCTYPE HTML>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="styling1.css">
  <script src="rules.js"></script>
  <script src="yav.js"></script>
  <script src="yav-config.js"></script>
  <script src="cookies.js"></script>
  <div class="header">
  <?php include('header.php'); ?>
    </div>
  <title>BDL Apprentice/Internship/Project work application form</title>
</head>
<body onload="deleteAllCookies(); alt();">
  <script>
    function alt() {
      alert("USE CHROME ONLY!");
    }
  </script>
  <table width="55%">
    <div id = errorsDiv></div>
    <form method="post" name="bdlform" action="report.php" id="bdlform" onsubmit="return yav.performCheck('bdlform',vltrules,'inline');">
      <tr>
      <th colspan="2"><span class="heads"><u><b>PERSONAL DETAILS:</b></u></span></th>
    </tr>
    <tr>
      <td><b><label for="Name">Name of the Applicant:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input id="name" name="name" type="text" onblur="return setCookie('name', document.getElementById('name').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_name" class="warn"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="mother details">Mother's Name:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="mother" name="mother" onblur="return setCookie('mother', document.getElementById('mother').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="warn" id="errorsDiv_mother"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="father details">Father's Name:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="father" name="father" onblur="return setCookie('father', document.getElementById('father').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="warn" id="errorsDiv_father"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="address">Permanent Address of the Applicant:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <textarea rows="5" id="address" name="address" columns="50" onblur="return setCookie('address', document.getElementById('address').value);"></textarea>&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="warn" id="errorsDiv_address"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="mobile">Mobile Number:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="mobile" name="mobile" onblur="return setCookie('mobile', document.getElementById('mobile').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_mobile" class="warn"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="eml">E-Mail ID:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="eml" name="email" onblur="return setCookie('eml', document.getElementById('eml').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_eml"></span>
        </div>
      </td>
    </tr>
  </table>
  <br><br>
  <table width="55%">
    <tr>
    <th colspan="2"><span class="heads"><u><b>COLLEGE DETAILS:</b></u></span></th>
    </tr>
    <tr>
      <td><b><label for="College">College/University:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="college" name="college" onblur="return setCookie('college', document.getElementById('college').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_college"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="city">City of the College/University:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="city" name="city" onblur="return setCookie('city', document.getElementById('city').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_city"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="degree">Degree:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="degree" name="degree" onblur="return setCookie('degree', document.getElementById('degree').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_degree"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="branch">Branch:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="branch" name="branch" onblur="return setCookie('branch', document.getElementById('branch').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_branch"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="semester">Semester/Trimester:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="semester" name="semester" onblur="return setCookie('semester', document.getElementById('semester').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_semester"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="id">College ID Number:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="id" name="id" onblur="return setCookie('id', document.getElementById('id').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_id"></span>
        </div>
      </td>
    </tr>
  </table>
  <br><br>
  <table width="55%">
    <tr>
    <th colspan="2"><span class="heads"><u><b>BANK AND DD DETAILS:</b></u></span></th>
    </tr>
    <tr>
      <td><b><label for="fee">Fee Amount:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="fee" name="fee" onblur="return setCookie('fee', document.getElementById('fee').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_fee"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="bank">Bank Name:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="bank" name="bank" onblur="return setCookie('bank', document.getElementById('bank').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_bank"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="dd">DD No.:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="dd"  name="dd" onblur="return setCookie('dd', document.getElementById('dd').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_dd"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="date">Dated:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="date" id="date" name="date" placeholder="DD-MM-YYYY" onblur="return setCookie('date', document.getElementById('date').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_date"></span>
        </div>
      </td>
    </tr>
    <tr>
      <td><b><label for="ref">Reference:</label>&nbsp;&nbsp;</b></td>
      <td>
        <div class="warn">
          <input type="text" id="ref" name="ref" onblur="return setCookie('ref', document.getElementById('ref').value);">&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="errorsDiv_ref"></span>
        </div>
      </td>
    </tr>
  </table>
  <br><br>
  <center>
    <input type="submit" value="Submit">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="Clear" onclick="this.form.reset();">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </center>
</form>
</body>
</html>

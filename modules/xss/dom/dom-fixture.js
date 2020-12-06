
module.exports = {
  rawData: '<img src="#" onerror="alert(document.getElementById("secret").innerHTML);this.parentNode.removeChild(this);"/>',
  correctHandling: '',
  incorrectEncoding: '',
  pageTemplate: `
<div>
  Home &gt; <label id="currentLocation"></label>
</div>

<script>
const whereAmI = decodeURIComponent(location.hash.substr(1));
document.getElementById('currentLocation').innerHTML = whereAmI;
</script>
  `
};

FOOTER DEDUPE + STYLE FIX (v2)

- Stronger JS cleanup: removes stray duplicate groups of category links anywhere in <footer> (not just extra blocks).
- CSS updated: default link color is white; hover is orange; visited stays white; visited+hover is red.

Usage
1) Add/replace CSS in <head>:
   <link rel="stylesheet" href="css/footer-uniform.css">

2) Include the script once before </body>:
   <script src="js/dedupe-footer-v2.js"></script>

3) Footer structure (one categories block only):
   <footer class="site-footer">
     <div class="footer-categories"> ... </div>
     <div class="footer-utilities"> ... </div>
   </footer>

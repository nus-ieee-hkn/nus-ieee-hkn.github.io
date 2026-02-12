<!DOCTYPE HTML>

<html style="overflow:auto">
	<head>
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-138650989-2"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', 'UA-138650989-2');
		</script>
		
		<title>IEEE-HKN NUS</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link rel="stylesheet" href="assets/css/main.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
	</head>
	<body class="landing is-preload">

		<!-- Page Wrapper -->
			<div id="page-wrapper">

				<!-- Header -->
					<header id="header">
						<h1><a href="index.html">IEEE-HKN NUS</a></h1>
						<nav id="nav">
							<ul>
								<li class="special">
									<a href="#menu" class="menuToggle"><span>Menu</span></a>
									<div id="menu">
										<ul>
											<li><a href="index.html"><i class="fa fa-home fa-fw" aria-hidden="true"></i>&nbsp; Home</a></li>
											<!-- To be implemented -->
											<li><a href="about.html"><i class="fa fa-info fa-fw" aria-hidden="true"></i>&nbsp; About</a></li>
											<li><a href="news-ece.html"><i class="fa fa-newspaper-o fa-fw" aria-hidden="true"></i>&nbsp; News</a></li>
											<li><a href="resources.html"><i class="fa fa-book fa-fw" aria-hidden="true"></i>&nbsp; Resources</a></li>
											<li><a href="calendar.html"><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>&nbsp; Calendar</a></li>
											<li><a href="committee.html"><i class="fa fa-user-secret fa-fw" aria-hidden="true"></i>&nbsp; Committee</a></li>
											<li><a href="members.html"><i class="fa fa-users fa-fw" aria-hidden="true"></i>&nbsp; Members</a></li>
											<li><a href="contactus.html"><i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i>&nbsp; Contact Us</a></li>
										</ul>
									</div>
								</li>
							</ul>
						</nav>
					</header>

				<!-- Main -->
					<article id="main">
						<header>
							<h2>Resources</h2>
							<p>Browse through the resources our members have curated<br>for various modules offered by NUS Electrical Engineering department.</p>
						</header>
					
						<!-- Add new section here -->

						<!-- Find past year paper solutions by module code. 
                        Solution files to be added under (new) folder "past year papers/~ mod code~" 
                        E.g. past year papers/CS1010E/CS1010E_AY1920_S2.pdf -->
						<section class="wrapper style5" id="searchPYP">
							<div class="inner">
                                <h2>ECE Past Year Papers</h2>
								<p>We are updating our database. Do look out for it in the near future!</p>
								<form action="#searchPYP" method="get" id="pyp_form" style="margin: 0 0 0.5em; width: 85%; display:inline-block">
									<input type="text" name="modCode" placeholder="Enter module code" value="" style="display:inline-block">
                                </form>
                                <button form="pyp_form" onclick="window.location='#searchPYP'">Search</button>
                                <div>
                                    <?php 
                                        if (!empty($_GET)) {
                                            $modCodeVal = $_GET['modCode'];
                                            $modCodeVal = strtoupper($modCodeVal);
                                            if ($modCodeVal != "") {
                                                $dir = "past year papers/" . $modCodeVal;   

                                                // Open a directory, and read its contents
                                                if (is_dir($dir)){
                                                    if ($dh = opendir($dir)){
                                                        while (($file = readdir($dh)) !== false){
                                                            if ($file != "." && $file != "..") 
                                                                echo "<a href='" . $dir."/".$file . "'>".$file."</a><br>";  
                                                        }
                                                        closedir($dh);
                                                    }
                                                } else {
                                                    echo '<br>Past year papers not found for "'.$modCodeVal.'".';
                                                }
                                            } else {
                                                echo "<br>Please enter a module code.";
                                            }
                                        } 
                                    ?>
                                </div>
							</div>
						</section>
					</article>


				<!-- Footer -->
					<footer id="footer">
						<ul class="icons">
							<li><a href="https://twitter.com/IEEE_EtaKappaNu?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
							<li><a href="https://www.facebook.com/IEEE.HKN/" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
							<!-- <li><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li> -->
							<!-- <li><a href="#" class="icon fa-dribbble"><span class="label">Dribbble</span></a></li> -->
							<li><a href="https://www.linkedin.com/company/nushkn" class="icon fa-linkedin"><span class="label">LinkedIn</span></a></li>
							<li><a href="https://github.com/nus-ieee-hkn" class="icon fa-github"><span class="label">Github</span></a></li>
							<li><a href="mailto:nus.ieee.hkn@gmail.com" class="icon fa-envelope-o"><span class="label">Email</span></a></li>
						</ul>
						<ul class="copyright">
							<li>&copy; IEEE-HKN NUS</li><li>Theme: <a href="http://html5up.net">HTML5 UP</a></li>
						</ul>
					</footer>

			</div>

            <!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/jquery.scrollex.min.js"></script>
			<script src="assets/js/jquery.scrolly.min.js"></script>
			<script src="assets/js/browser.min.js"></script>
			<script src="assets/js/breakpoints.min.js"></script>
			<script src="assets/js/util.js"></script>
			<script src="assets/js/main.js"></script>

	</body>
</html>
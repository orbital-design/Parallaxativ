<?php
/**
 * Plugin Name: Parallaxativ
 * Plugin URI: https://orbital.co.uk
 * Description: Parallaxativ - A suite of block extensions to add interactions to existing blocks.
 * Author: Adam Cullen (addzycullen)
 * Author URI: https://twitter.com/addzycullen
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'Parallaxativ' ) ) :
	/**
	 * Main Parallaxativ Class.
	 *
	 * @since 1.0.0
	 */
	final class Parallaxativ {
		/**
		 * This plugin's instance.
		 *
		 * @var Parallaxativ
		 * @since 1.0.0
		 */
		private static $instance;

		/**
		 * Main Parallaxativ Instance.
		 *
		 * Insures that only one instance of Parallaxativ exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @since 1.0.0
		 * @static
		 * @return object|Parallaxativ The one true Parallaxativ
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Parallaxativ ) ) {
				self::$instance = new Parallaxativ();
				self::$instance->constants();
				self::$instance->includes();
			}
			return self::$instance;
		}

		/**
		 * Throw error on object clone.
		 *
		 * The whole idea of the singleton design pattern is that there is a single
		 * object therefore, we don't want the object to be cloned.
		 *
		 * @since 1.0.0
		 * @access protected
		 * @return void
		 */
		public function __clone() {
			// Cloning instances of the class is forbidden.
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheating huh?', 'parallaxativ_extensions' ), '1.0' );
		}

		/**
		 * Disable unserializing of the class.
		 *
		 * @since 1.0.0
		 * @access protected
		 * @return void
		 */
		public function __wakeup() {
			// Unserializing instances of the class is forbidden.
			_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheating huh?', 'parallaxativ_extensions' ), '1.0' );
		}

		/**
		 * Setup plugin constants.
		 *
		 * @access private
		 * @since 1.0.0
		 * @return void
		 */
		private function constants() {
			$this->define( 'PARALLAXATIV_VERSION', '1.0.0' );
			$this->define( 'PARALLAXATIV_HAS_PRO', false );
			$this->define( 'PARALLAXATIV_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
			$this->define( 'PARALLAXATIV_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
			$this->define( 'PARALLAXATIV_PLUGIN_FILE', __FILE__ );
			$this->define( 'PARALLAXATIV_PLUGIN_BASE', plugin_basename( __FILE__ ) );
		}

		/**
		 * Define constant if not already set.
		 *
		 * @param  string|string $name Name of the definition.
		 * @param  string|bool   $value Default value.
		 */
		private function define( $name, $value ) {
			if ( ! defined( $name ) ) {
				define( $name, $value );
			}
		}

		/**
		 * Include required files.
		 *
		 * @access private
		 * @since 1.0.0
		 * @return void
		 */
		private function includes() {
			require_once PARALLAXATIV_PLUGIN_DIR . 'includes/class-parallaxativ-assets.php';
			require_once SOPHIA_BLOCKS_PLUGIN_DIR . 'includes/class-github-updater.php';

			$updater = new Github_Updater( __FILE__ );
			$updater->set_username( 'addzycullen' );
			$updater->set_repository( 'Parallaxativ' );
			$updater->authorize( 'dce8d5d5228104bb8c6f0383a07ea21bb312dfe9' ); // Your auth code goes here for private repos
			$updater->initialize();
		}
	}
endif;

/**
 * The main function for that returns Parallaxativ
 *
 * The main function responsible for returning the one true Parallaxativ
 * Instance to functions everywhere.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $parallaxativ_exts = Parallaxativ(); ?>
 *
 * @since 1.0.0
 * @return object|Parallaxativ The one true Parallaxativ Instance.
 */
function parallaxativ_exts() {
	return Parallaxativ::instance();
}

// Get the plugin running. Load on plugins_loaded action to avoid issue on multisite.
if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	add_action( 'plugins_loaded', 'parallaxativ_exts', 90 );
} else {
	parallaxativ_exts();
}

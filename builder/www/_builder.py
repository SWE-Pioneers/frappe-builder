import frappe
from frappe.integrations.frappe_providers.frappecloud_billing import is_fc_site
from frappe.pulse.utils import get_app_version
from frappe.translate import get_user_lang
from frappe.utils.jinja_globals import is_rtl
from frappe.utils.telemetry import capture

from builder.hooks import builder_path

no_cache = 1


def get_context(context):
	csrf_token = frappe.sessions.get_csrf_token()
	frappe.db.commit()
	context.csrf_token = csrf_token
	context.site_name = frappe.local.site
	context.builder_path = builder_path
	context.builder_version = get_app_version("builder")
	# language / direction for the <html> tag (RTL support)
	context.lang = get_user_lang()
	context.text_direction = "rtl" if is_rtl() else "ltr"
	# developer mode
	context.is_developer_mode = frappe.conf.developer_mode
	context.is_fc_site = is_fc_site()
	if frappe.session.user != "Guest":
		capture("active_site", "builder")

"use client"
import {Tabs} from "@heroui/react";
export function BasicTabs(){ return (
  <Tabs className="w-full max-w-md">
    <Tabs.ListContainer><Tabs.List aria-label="Options"><Tabs.Tab id="overview">Overview<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="analytics">Analytics<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="reports">Reports<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer>
    <Tabs.Panel className="pt-4" id="overview"><p>View your project overview and recent activity.</p></Tabs.Panel>
    <Tabs.Panel className="pt-4" id="analytics"><p>Track your metrics and analyze performance data.</p></Tabs.Panel>
    <Tabs.Panel className="pt-4" id="reports"><p>Generate and download detailed reports.</p></Tabs.Panel>
  </Tabs>
)}
export function VerticalTabs(){ return (
  <Tabs className="w-full max-w-lg" orientation="vertical">
    <Tabs.ListContainer><Tabs.List aria-label="Vertical tabs"><Tabs.Tab id="account">Account<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="security">Security<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="notifications">Notifications<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="billing">Billing<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer>
    <Tabs.Panel className="px-4" id="account"><h3 className="font-semibold">Account</h3><p className="text-sm text-muted">Manage your account information.</p></Tabs.Panel>
    <Tabs.Panel className="px-4" id="security"><h3 className="font-semibold">Security</h3><p className="text-sm text-muted">Configure 2FA and password.</p></Tabs.Panel>
    <Tabs.Panel className="px-4" id="notifications"><h3 className="font-semibold">Notifications</h3><p className="text-sm text-muted">Choose notification preferences.</p></Tabs.Panel>
    <Tabs.Panel className="px-4" id="billing"><h3 className="font-semibold">Billing</h3><p className="text-sm text-muted">Manage subscription.</p></Tabs.Panel>
  </Tabs>
)}

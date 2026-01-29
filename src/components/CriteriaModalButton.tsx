"use client"
import React from "react"
import BasicModal from "@/components/smoothui/ui/BasicModal"
import { Button } from "@/components/ui/button"



export default function CriteriaModalButton() {
  const [isOpen, setIsOpen] = React.useState(false)
  const state =  "California"

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setIsOpen(true)}>
        Read Criteria
      </Button>

      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Eligibility & Requirements"
        size="xl"
      >
        <div className="flex flex-col gap-6 text-base leading-7">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight md:text-xl">Eligibility Criteria</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Must be a current resident of the state of {state}.</li>
              <li>Must have an annual income below $80,000.</li>
              <li>Must possess a valid, government-issued ID.</li>
            </ul>
          </section>

          <div className="border-t" />

          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight md:text-xl">Things to Know</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>This program is currently for individuals seeking to move into a new rental unit.</li>
              <li>Assistance for back rent or for your current unit will be available soon.</li>
              <li>This program covers rent payments only. It does not cover security deposits, utilities, pet fees, or any other move-in costs.</li>
            </ul>
          </section>

          <div className="border-t" />

          <section className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight md:text-xl">Documentation Required</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>A valid government-issued ID.</li>
              <li>Recent pay stub(s).</li>
              <li>Bank statements from the last two months.</li>
              <li>Additional documentation may be requested if needed.</li>
            </ul>
          </section>

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </BasicModal>
    </>
  )
}
